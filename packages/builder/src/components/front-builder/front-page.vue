<script lang="ts">
import type { VueConstructor } from 'vue'
import type { HighlightInfo, InsertInfo } from '../../store/modules/front'
import { debounce, sortBy } from 'lodash'
import invariant from 'tiny-invariant'
import Vue from 'vue'

import { mapGetters, mapState } from 'vuex'
import { createImageURL, uploadLogo } from '../../api'
import { useScreenObserve } from '../../lib/use-screen-observe'
import { commonHelpers, SET_SCALE } from '../../store/modules/common'
import {
  frontHelpers,
  INSERT_BLOCK,
  SET_ELEMENT_IMAGE,
  SET_IMAGE_SWAP_INFO,
  SET_SELECTED_BLOCK,
  UPDATE_DESK,
} from '../../store/modules/front'
import DeskSelect from '../common/desk-select.vue'
import { createEditableStyles, FormatToolbar } from '../common/format-toolbar'
import { SnackBarContainer } from '../common/snack-bar'
import BlockControls from './block-controls.vue'
import BlockPicker from './block-picker.vue'
import FrontViewport from './front-viewport.vue'
import { UploadLogo } from './upload-logo'
import WarnEmptyDesk from './warn-empty-desk.vue'
import WarnInsufficient from './warn-insufficient.vue'

interface ControlInfo {
  id: string
  top: string
  desks?: string[]
}

interface MappedSelectedInfo {
  id: string
  top: number
  order: number
  bottom: number
}

interface Refs {
  scroll: HTMLElement
}

type withRefs = VueConstructor<Vue & { $refs: Refs; animation?: Animation }>

const TOP_PADDING = 16 * 6 // 6rem
const LEFT_PADDING = 16 * 12 // 12rem

const { innerHeight, innerWidth } = useScreenObserve()

export default (Vue as withRefs).extend({
  components: {
    BlockPicker,
    BlockControls,
    DeskSelect,
    FormatToolbar,
    FrontViewport,
    UploadLogo,
    WarnInsufficient,
    WarnEmptyDesk,
    SnackBarContainer,
  },

  data: () => ({
    observer: {} as ResizeObserver,
    scrollWidth: 0,
    scrollHeight: 0,
    selectedBlockType: '',
  }),

  computed: {
    previewPath(): unknown {
      return {
        name: 'front-preview',
        params: { clientID: this.$route.params.clientID },
      }
    },
    desks(): [string, string][] {
      const { selectedBlock } = this

      if (!selectedBlock) {
        return []
      }

      return sortBy([...Object.entries(selectedBlock.desks)] as [string, string][], ([order]) => order)
    },

    controls(): ControlInfo[] {
      if (this.isInsertMode || !this.selectedInfo) {
        return []
      }

      const info = this.selectedInfo
      // // some padding for the block controls
      // const space = (this.scrollHeight - 128) / this.blocks.length
      // const top = info.order * space
      const top = 28
      return [
        {
          id: info.id,
          top: `${top}px`,
        },
      ]
    },

    selectedInfo(): MappedSelectedInfo | null {
      if (!this.selectedBlock) {
        return null
      }

      const info = this.selectedBlock

      return {
        id: info.id,
        top: info.top * this.scale,
        order: info.order,
        bottom: (info.top + info.height) * this.scale,
      }
    },

    scale(): number {
      const { isPreviewMode, isInsertMode, scrollWidth, iFrameWidth } = this
      if (isPreviewMode) return 1

      const fullWidth = isInsertMode ? scrollWidth : innerWidth.value - 2 * LEFT_PADDING
      return Math.max(iFrameWidth / fullWidth, 1)
    },

    iFrameWidth(): number {
      if (this.isPreviewMode) return this.scrollWidth

      const { breakpoint } = this

      switch (breakpoint) {
        case 'xs':
          return 375

        case 'md':
          return 768

        case 'lg':
          return 1500
      }
      invariant(false, 'unreachable')
      return 1250
    },

    iFrameHeight(): number {
      const { isInsertMode, isPreviewMode, scale, height } = this
      if (isInsertMode) return height

      const fullHight = Math.min(innerHeight.value, height)

      if (isPreviewMode) return fullHight

      return (fullHight - TOP_PADDING) * scale
    },

    isInsertMode(): boolean {
      return this.insertPoint !== null
    },

    isImageUploadShow: {
      get(): unknown {
        return !!this.imageSwapInfo
      },
      set(val: boolean) {
        if (!val) {
          this.setImageSwapInfo(null)
        }
      },
    },

    imageSrc(): string | undefined {
      if (!this.imageSwapInfo) {
        return
      }

      const { path } = this.imageSwapInfo

      return path.reduce((obj: Record<string, any>, key: string) => obj[key], this.images)
    },

    hasSelected(): boolean {
      return this.selectedElement
    },

    sectionName(): string {
      return this.selectedElement?.display ?? 'select section'
    },

    editableStyles(): Vue {
      return createEditableStyles({
        getStyles: () => {
          return this.styles
        },

        setStyle: (val: any) => {
          if (!this.selectedElement) {
            return
          }
          this.setElementStyle({ path: this.selectedElement.path, data: val })
        },
      })
    },

    wrapperStyles(): Record<string, unknown> {
      const { insertPoint } = this

      if (!insertPoint) {
        return {}
      }

      const { clientHeight } = document.documentElement
      const { scale, highlightedBlock, height } = this
      const offset = insertPoint.offset
      const highlightedBlockHeight = highlightedBlock?.height || 0
      return {
        overflow: 'hidden',
        transform: `translateY(${clientHeight * 0.4 - (offset + highlightedBlockHeight * 0.5) / scale}px)`,
        right: '0',
        height: `${height * scale}px`,
      }
    },

    ...mapState(['preview']),
    ...mapGetters(['isPreviewMode', 'breakpoint']),
    ...frontHelpers.mapState([
      'insertPoint',
      'imageSwapInfo',
      'selectedElement',
      'images',
      'height',
      'highlightedBlock',
      'customBlocks',
    ]),

    ...frontHelpers.mapGetters({
      blocks: 'displayBlocks',
      styles: 'elementStyles',
      styleOptions: 'styleOptions',
      selectedBlock: 'selectedBlock',
      defaultHighlight: 'defaultHighlight',
    }),
  },

  methods: {
    handleDesk([order, desk]: [string, string]) {
      const { id } = this.selectedBlock

      this.updateDesk({
        id,
        order,
        desk,
      })
    },

    handleDialogClick(_name: string) {
      this.isImageUploadShow = false
    },

    clearControls() {
      this.setSelectedBlock(null)
    },

    computePosition(info: HighlightInfo, insertPoint: InsertInfo) {
      const { scale } = this
      const { height } = info
      const { clientHeight } = document.documentElement
      const offset = insertPoint.offset * scale
      const from = clientHeight / 2 - offset - TOP_PADDING
      const to = clientHeight / 2 - offset - TOP_PADDING - (height / 2) * scale
      return { from, to }
    },

    animateScrollArea(from: number, to: number) {
      const $scroll = this.$refs.scroll
      this.animation = $scroll.animate(
        [
          {
            top: `${from}px`,
          },
          {
            top: `${to}px`,
          },
        ],
        { duration: 0, easing: 'ease-in-out', fill: 'forwards' },
      )
    },

    async handleUploadLogo(event: InputEvent) {
      const $input = event.target as HTMLInputElement
      const file = $input.files?.[0]
      if (file) {
        const { path } = this.imageSwapInfo
        const url = await uploadLogo(file)
        const data = createImageURL(url)
        this.setElementImage({ path, data })
        this.setImageSwapInfo(null)
      }
    },

    updateScrollSize() {
      this.scrollWidth = this.$refs.scroll.clientWidth
      this.scrollHeight = this.$refs.scroll.clientHeight
    },
    updateScale: debounce(function () {
      // @ts-expect-error
      this.setScale(this.scale)
    }, 250),

    ...frontHelpers.mapMutations({
      insertBlock: INSERT_BLOCK,
      setSelectedBlock: SET_SELECTED_BLOCK,
      setImageSwapInfo: SET_IMAGE_SWAP_INFO,
      updateDesk: UPDATE_DESK,
      setElementImage: SET_ELEMENT_IMAGE,
    }),
    ...commonHelpers.mapMutations({
      setScale: SET_SCALE,
    }),
    ...commonHelpers.mapActions(['fetchSite']),
    ...frontHelpers.mapActions(['setElementStyle', 'listDesks', 'fetchCustomBlocks']),
  },

  watch: {
    insertPoint(info) {
      if (!info) {
        this.animation?.cancel()
        this.selectedBlockType = ''
      }
    },

    async highlightedBlock(info: HighlightInfo | null, old: HighlightInfo | null) {
      await Vue.nextTick()
      const { insertPoint } = this
      if (!insertPoint) {
        return
      }

      if (info == null) {
        if (old != null) {
          const { from, to } = this.computePosition(old, insertPoint)
          this.animateScrollArea(to, from)
        }
        return
      }

      const { from, to } = this.computePosition(info, insertPoint)
      this.animateScrollArea(from, to)
    },

    isPreviewMode() {
      this.setSelectedBlock(null)
    },
    scrollWidth() {
      this.setScale(this.scale)
    },
    breakpoint() {
      this.setScale(this.scale)
    },
  },

  mounted() {
    // must run in main frame
    this.listDesks()
    this.fetchSite()
    this.fetchCustomBlocks()

    this.updateScrollSize()
    this.observer = new ResizeObserver(this.updateScrollSize)
    this.observer.observe(this.$refs.scroll)
  },

  beforeDestroy() {
    this.observer.unobserve(this.$refs.scroll)
    this.setSelectedBlock(null)
  },
})
</script>

<template>
  <div class="relative h-full">
    <div v-show="!isInsertMode" class="absolute mx-2" :class="[isPreviewMode ? 'top-2' : 'top-14']">
      <FormatToolbar :editable-styles="editableStyles" :has-selected="hasSelected" :section-name="sectionName" />
    </div>
    <div class="flex h-full w-full" :class="isInsertMode && 'insert-mode'" @click="clearControls">
      <BlockPicker v-show="isInsertMode" :type="selectedBlockType" class="block-picker" />
      <div ref="scroll" class="front-page-wrapper grow" :style="wrapperStyles">
        <div class="button-spaces">
          <div class="front-page-paper" :class="preview === 'desktop' && 'max-w-[1500px] grow'">
            <transition-group v-show="!isPreviewMode" name="left-shift">
              <div v-for="info in controls" :key="info.id" class="control control--left" :style="{ top: info.top }">
                <DeskSelect
                  v-for="[order, desk] of desks"
                  :key="order"
                  :order="order"
                  class="relative mb-2 mr-6"
                  :value="desk"
                  @input="handleDesk"
                />
              </div>
            </transition-group>
            <transition-group v-show="!isPreviewMode" name="right-shift">
              <div v-for="info of controls" :key="info.id" class="control control--right" :style="{ top: info.top }">
                <BlockControls :key="info.id" @set-type="selectedBlockType = $event" />
              </div>
            </transition-group>
            <!-- the `relative` is using for controlling the stack order -->
            <FrontViewport :i-frame-height="iFrameHeight" :i-frame-width="iFrameWidth" />
          </div>
        </div>
      </div>
      <UploadLogo v-model="isImageUploadShow" @click="handleDialogClick">
        <div v-if="imageSrc" class="group relative flex h-full w-full items-center px-4">
          <img v-image-fade-in :src="imageSrc" alt="upload-image-preview" />
          <label>
            <div class="absolute inset-0 hidden h-full w-full items-center justify-center group-hover:flex">
              <div class="absolute h-full w-full bg-black opacity-30" />
              <span class="flex items-center justify-center text-8xl">
                <i class="icon-upload" />
              </span>
            </div>
            <input class="hidden" type="file" @change="handleUploadLogo" />
          </label>
        </div>
      </UploadLogo>
    </div>
    <SnackBarContainer>
      <WarnInsufficient />
      <WarnEmptyDesk />
    </SnackBarContainer>
  </div>
</template>

<style lang="scss" scoped>
.block-picker {
  @apply ease-easing -translate-x-full transform opacity-0 delay-0 duration-300;

  transition-property: max-width, transform, opacity;
  width: 47rem;

  .insert-mode & {
    @apply translate-x-0 transform opacity-100 delay-300;

    transition-property: transform, opacity;
  }
}

.front-page-wrapper {
  @apply mx-auto h-full w-full overflow-y-auto;

  // @apply duration-300 ease-easing;

  // transition-property: width;

  .desktop &,
  .tablet &,
  .mobile & {
    @apply pt-24;
  }

  .insert-mode & {
    width: calc(100% - 47rem);
    padding-left: 1.25rem;
    padding-right: 1.875rem;
  }

  &::-webkit-scrollbar {
    @apply border;

    width: 7px;
  }

  &::-webkit-scrollbar-track-piece:start,
  &::-webkit-scrollbar-track-piece:end {
    @apply bg-transparent;
  }

  &::-webkit-scrollbar-thumb {
    @apply bg-almost-black bg-opacity-33 rounded-lg;
  }
}

.front-page-paper {
  @apply shadow-1 relative mx-auto bg-white;

  .expanded & {
    @apply w-full;
  }

  .tablet & {
    width: 768px;
  }

  .mobile & {
    width: 375px;
  }

  .insert-mode & {
    @apply w-full;
  }
}

.control {
  @apply absolute top-0;
  @apply opacity-100;

  &--left {
    @apply left-0 space-y-2;

    transform: translateX(-100%);
  }

  &--right {
    @apply right-0;

    transform: translateX(100%);
  }
}

.button-spaces {
  @apply mx-auto flex;

  padding-left: 12rem;
  padding-right: 12rem;

  .insert-mode &,
  .expanded & {
    @apply px-0;
    @apply max-w-none;
  }
}

%left-shift-animation {
  animation: 0.15s ease-in-out both running left-shift;
}

%right-shift-animation {
  animation: 0.15s ease-in-out both running right-shift;
}

.left-shift-enter-active {
  @extend %left-shift-animation;
}

.right-shift-enter-active {
  @extend %right-shift-animation;
}

.left-shift-leave-active {
  @extend %left-shift-animation;

  animation-direction: reverse;
}

.right-shift-leave-active {
  @extend %right-shift-animation;

  animation-direction: reverse;
}

@keyframes left-shift {
  from {
    @apply opacity-0;

    transform: translateX(0);
  }

  to {
    @apply opacity-100;

    transform: translateX(-100%);
  }
}

@keyframes right-shift {
  from {
    @apply opacity-0;

    transform: translateX(0);
  }

  to {
    @apply opacity-100;

    transform: translateX(100%);
  }
}
</style>
