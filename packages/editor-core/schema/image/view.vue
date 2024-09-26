<script lang="ts">
import type { ImageInfo } from '../../core/api'
import type { DialogInfo } from '../../modules/remote-dialog'
import type { Upload } from './drop-bus'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-2'
import delay from 'delay'

import { debounce } from 'lodash'
import { CircularProgress } from 'shared/components/circular-progress'
import Vue from 'vue'
import { getAPI } from '../../core/api'
import { clientID } from '../../core/client'
import { PRESETS } from '../../core/resize'
import { useRemoteDialog } from '../../modules/remote-dialog'
import { RichInput } from '../../rich-input'
import { warnExceedSizeLimit } from '../schema-bus'
import { isFileExceedSizeLimit } from '../utils'
import { droppedItems } from './drop-bus'
import Mountains from './mountains.svg'
import { imageClass } from './utils'

interface Progress {
  val: number
  max: number
}

interface Data {
  isAlt: boolean
  url: string
  progress: null | Progress
  indeterminate: boolean
  tempImage: string
  message: string
}
interface UnsplashPhoto {
  src: string
  alt: string
  title: string
}

type UnsplashDialogInfo = DialogInfo<'unsplash', true, UnsplashPhoto>

export default Vue.extend({
  name: 'ImageView',

  components: { NodeViewWrapper, CircularProgress, RichInput, Mountains },

  props: {
    ...nodeViewProps,
  },

  data(): Data {
    return {
      isAlt: false,
      url: '',
      progress: null,
      tempImage: '',
      indeterminate: false,
      message: '',
    }
  },

  computed: {
    haveImage(): boolean {
      return !!this.node.attrs.src
    },
    src(): string {
      return this.tempImage || this.node.attrs.src
    },
    title(): string {
      return this.node.attrs.title
    },
    alt(): string {
      return this.node.attrs.alt
    },
    provider(): string | null {
      return this.node.attrs.provider
    },
    isIssuer(): boolean {
      return this.node.attrs.cid === clientID
    },
    source(): string {
      return JSON.stringify(this.node.attrs.source)
    },
    sources(): object[] {
      return this.node.attrs.source
    },
    complete(): boolean {
      return !!this.alt
    },
    imageClass(): Record<string, boolean> {
      const cls = this.src ? imageClass(this.node) : 'no-image'
      const caption = this.title && this.title !== '<p></p>'
      return {
        [cls]: true,
        'no-caption': !caption,
        'has-focus': this.selected,
      }
    },
    style(): Record<string, string> {
      if (this.src) {
        return {}
      }

      return {
        width: '100%',
      }
    },
    content: {
      get(): string {
        return this.isAlt ? this.alt : this.title
      },
      set: debounce(function (this: { updateAttributes: (attrs: object) => void; isAlt: boolean }, val: string) {
        const key = this.isAlt ? 'alt' : 'title'
        this.updateAttributes({ [key]: val })
      }, 250),
    },
  },

  watch: {
    selected(val: boolean) {
      if (!val) {
        this.switchToTitle()
      }
    },
  },

  async mounted() {
    if (this.provider && this.isIssuer) {
      const { open } = useRemoteDialog<UnsplashDialogInfo>('unsplash')
      const res = await open(true)
      if (res) {
        this.updateAttributes({ ...res, cid: null, provider: null })
      } else {
        this.removeSelf()
      }
      return
    }

    const fileId = this.node.attrs.file
    if (!fileId) {
      return
    }

    const item = droppedItems.get(fileId)
    if (!item) {
      return
    }

    droppedItems.delete(fileId)
    this.processUpload(item)
  },

  methods: {
    async onUpload(event: InputEvent) {
      const target = event.target as HTMLInputElement
      const img = (target.files as FileList)[0]
      if (isFileExceedSizeLimit(img)) {
        warnExceedSizeLimit.post()
        return
      }
      this.processFile(img)
    },

    async processFile(img: File) {
      this.message = 'Preparing...'
      this.progress = { val: 0, max: 3 }
      this.tempImage = URL.createObjectURL(img)
      const api = getAPI()
      this.message = 'Uploading...'
      const info = await api.uploadImage(img)
      this.updateAttributes({ src: api.createImageURL(info), source: [], file: null })
      if (this.tempImage) {
        URL.revokeObjectURL(this.tempImage)
        this.tempImage = ''
      }

      await this.optimizeImage(img, info)
      this.progress = { val: 3, max: 3 }
      this.message = 'Complete'
      await delay(500)
      this.progress = null
    },

    async optimizeImage(img: File, info: ImageInfo) {
      // Don't process svg & gif file
      if (img.type.startsWith('image/svg') || img.type === 'image/gif') {
        return
      }

      const api = getAPI()

      const url = api.createImageURL(info)
      const source = [
        {
          srcset: url,
          type: img.type,
          media: '(min-width: 1680px)' as string | undefined,
        },
      ]
      for (const { width, media } of PRESETS) {
        const url = api.createImageURL(info, { width })
        source.push({ srcset: url, type: img.type, media })
      }
      this.updateAttributes({ source })
    },

    async processUrl(promise: Promise<string>) {
      this.indeterminate = true
      this.message = 'Uploading...'
      const res = await promise
      this.indeterminate = false
      this.message = ''
      this.updateAttributes({ src: res })
      this.setSelection()
    },

    processUpload(upload: Upload) {
      switch (upload.kind) {
        case 'file':
          this.processFile(upload.file)
          break

        case 'url':
          this.processUrl(upload.promise)
          break
      }
    },

    handleReplace() {
      if (this.indeterminate || this.progress) {
        return
      }

      const $upload = this.$refs.upload as HTMLElement
      $upload.click()
    },
    setType(name: string) {
      this.updateAttributes({ type: name })
    },
    async switchType() {
      this.isAlt = !this.isAlt

      await Vue.nextTick()
      const $input = this.$refs.input as HTMLInputElement
      $input?.focus()
    },
    switchToTitle() {
      this.isAlt = false
    },
    setSelection() {
      this.editor.chain().setNodeSelection(this.getPos()).focus().run()
    },
    removeSelf() {
      this.deleteNode()
    },
  },
})
</script>

<template>
  <NodeViewWrapper
    class="image interactive-node clear-both"
    :class="imageClass"
    :style="style"
    data-format="image"
    :data-title="title"
    :data-alt="alt"
    :data-src="src"
    :data-source="source"
    :data-provider="provider"
    @click.native="setSelection"
    @set-regular.native="setType('regular')"
    @full-width.native="setType('full-width')"
    @set-wide.native="setType('wide')"
    @replace-image.native="handleReplace"
  >
    <figure>
      <template v-if="src">
        <div class="relative">
          <picture class="pointer-events-none">
            <template v-if="!tempImage">
              <source
                v-for="img in sources"
                :key="img.srcset"
                :srcset="img.srcset"
                :type="img.type"
                :media="img.media"
              />
            </template>

            <img ref="img" :src="src" :title="title" :alt="alt" class="w-full" />
          </picture>

          <div v-if="!complete" class="image__indicator">Missing alt text</div>
        </div>
      </template>

      <label v-else-if="!provider" class="selector font-lato">
        <Mountains />
        <span>Click to select an image</span>

        <input
          ref="upload"
          class="hidden"
          type="file"
          accept="image/gif,image/jpeg,image/png,image/svg+xml"
          name="image"
          @change="onUpload"
        />
      </label>

      <div
        v-if="progress || indeterminate"
        class="absolute inset-0 flex h-full w-full flex-col items-center justify-center"
      >
        <div class="absolute inset-0 h-full w-full rounded-sm bg-black opacity-50" />

        <CircularProgress
          class="z-10"
          :indeterminate="indeterminate"
          :value="progress && progress.val"
          :max="progress && progress.max"
        />

        <div class="font-lato z-10 text-2xl text-white">{{ message }}</div>
      </div>

      <input
        v-if="haveImage"
        ref="upload"
        class="hidden"
        type="file"
        accept="image/gif,image/jpeg,image/png,image/svg+xml"
        name="image"
        @change="onUpload"
      />

      <figcaption v-if="src && (!provider || haveImage)" class="caption relative mt-1" @mousedown.stop>
        <RichInput v-if="!isAlt" ref="input" v-model="content" class="caption-text" @cut.stop @copy.stop @paste.stop />

        <input v-else ref="input" v-model="content" class="caption-text" @click.stop @cut.stop @copy.stop @paste.stop />

        <button class="caption-button" :class="isAlt && 'caption-button--active'" @click.stop="switchType">Alt</button>
      </figcaption>
    </figure>
  </NodeViewWrapper>
</template>

<style lang="scss" scoped>
.image {
  @apply rounded-sm;

  padding: 1px !important; // stylelint-disable-line declaration-no-important

  &__indicator {
    @apply shadow-2 font-lato rounded-sm;
    @apply text-almost-black absolute bottom-0 left-1/2 mx-auto mb-3 -translate-x-1/2 transform bg-white font-light;

    padding: 4px 8px;
  }

  .selector {
    @apply flex flex-col items-center justify-center;
    @apply h-64 w-full;
    @apply cursor-pointer rounded;

    border: solid 1px #d2e0e0;
    background-color: rgb(241 247 255 / 50%);

    span {
      color: #485353;
      font-size: 12px;
    }
  }

  .caption-text {
    &:focus {
      @apply outline-none;
    }

    &::placeholder {
      @apply font-light;

      color: #485353;
    }
  }

  .caption-button {
    @apply border-silver text-charcoal-grey absolute right-0 top-0 my-px mr-1 rounded
      border bg-transparent px-2 font-light;

    &--active {
      @apply bg-clear-blue text-clear-blue bg-opacity-20;
    }
  }

  &.no-image {
    @apply w-full;
  }

  &.no-caption {
    .caption {
      @apply hidden;
    }

    &.has-focus {
      .caption {
        @apply block;
      }
    }
  }
}
</style>
