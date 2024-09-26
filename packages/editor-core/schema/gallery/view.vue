<script lang="ts">
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-2'
import pMap from 'p-map'
import { SlickList } from 'vue-slicksort'

import { getAPI } from '../../core/api'
import { warnExceedSizeLimit } from '../schema-bus'
import { isFileExceedSizeLimit } from '../utils'
import Gallery from './gallery-placeholder.svg'
import ImageItem from './image-item.vue'

export default defineComponent({
  name: 'GalleryView',
  components: { SlickList, Gallery, NodeViewWrapper, ImageItem },
  props: {
    ...nodeViewProps,
  },
  data: () => ({ pending: [] as string[] }),
  computed: {
    empty(): boolean {
      return this.node.attrs.images.length === 0
    },
    images: {
      get(): string[] {
        return this.node.attrs.images
      },
      set(val: string[]) {
        this.updateAttributes({ images: val })
      },
    },
    list: {
      get(): string[] {
        return this.images
      },
      set(list: string[]) {
        const images = list.slice(0, this.images.length)
        if (images.length < this.images.length || images.some((url) => url.startsWith('blob:'))) {
          return
        }
        this.images = images
      },
    },
    title: {
      get(): string {
        return this.node.attrs.title
      },
      set(title: string) {
        this.updateAttributes({ title })
      },
    },
  },
  watch: {
    async selected(val) {
      if (val) {
        await nextTick()

        const $input = this.$refs.input as HTMLElement | undefined
        if ($input) {
          $input.focus()
        }
      }
    },
  },
  methods: {
    handleAdd() {
      const $upload = this.$refs.upload as HTMLInputElement
      $upload.click()
    },
    handleDelete(target: string) {
      this.images = this.images.filter((url) => url !== target)
    },
    setSelection() {
      this.editor.commands.setNodeSelection(this.getPos())
    },
    async onUpload(event: InputEvent) {
      const target = event.target as HTMLInputElement
      // upper bound is 9 pictures
      let warnForSize = false

      const imgs = [...(target.files as FileList)].slice(0, 9 - this.images.length).filter((file) => {
        if (isFileExceedSizeLimit(file)) {
          warnForSize = true
          return false
        }
        return true
      })

      if (warnForSize) {
        warnExceedSizeLimit.post()
      }

      const api = getAPI()
      const results = await pMap(imgs, async (file) => {
        const url = URL.createObjectURL(file)
        this.pending.push(url)
        const res = await api.uploadImage(file)
        this.pending = this.pending.filter((x) => x !== url)
        URL.revokeObjectURL(url)
        return res
      })

      this.images = this.images.concat(results.map((info) => api.createImageURL(info)))
    },
  },
})
</script>

<template>
  <NodeViewWrapper
    class="gallery interactive-node clear-both"
    :class="[!title && 'no-caption', selected && 'has-focus']"
    data-format="gallery"
    :data-title="title"
    @add-image.native="handleAdd"
  >
    <div class="w-full" @click="setSelection">
      <SlickList
        v-if="!empty"
        ref="list"
        v-model="list"
        class="flex flex-wrap gap-y-1"
        axis="xy"
        :class="images.length > 4 ? 'items-3-col' : 'items-2-col'"
      >
        <ImageItem v-for="(image, index) in images" :key="image" :index="index" :url="image" @delete="handleDelete" />
        <ImageItem
          v-for="(url, index) in pending"
          :key="url"
          :index="index + images.length"
          disabled
          uploading
          :url="url"
        />
      </SlickList>
      <div class="selector" :class="!empty && 'selector--hide'">
        <Gallery />
        <span>Click to select up to 9 images</span>
        <input
          ref="upload"
          class="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          type="file"
          accept="image/*"
          multiple
          name="image"
          @change="onUpload"
        />
      </div>
    </div>
    <div class="caption relative w-full">
      <input
        ref="input"
        v-model="title"
        class="caption-text w-full border p-1"
        placeholder="Type caption for gallery (optional)"
      />
    </div>
  </NodeViewWrapper>
</template>

<style lang="scss" scoped>
.gallery {
  @apply rounded-sm;

  padding: 1px !important; // stylelint-disable-line declaration-no-important

  .items-2-col {
    &::v-deep {
      .image {
        flex-basis: 50%;
      }
    }
  }

  .items-3-col {
    &::v-deep {
      .image {
        flex-basis: 33.33%;
      }
    }
  }

  .selector {
    @apply flex flex-col items-center justify-center;
    @apply h-64 w-full;
    @apply rounded;

    border: solid 1px #d2e0e0;
    background-color: rgb(241 247 255 / 50%);

    &--hide {
      @apply hidden;
    }

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
