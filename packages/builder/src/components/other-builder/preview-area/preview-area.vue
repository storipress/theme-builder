<script lang="ts">
import type { VueConstructor } from 'vue'
import { isSafari } from 'shared/utils'
import invariant from 'tiny-invariant'
import Vue from 'vue'

import { useScreenObserve } from '../../../lib/use-screen-observe'
import { otherHelper } from '../../../store/modules/other'
import { SET_SECTION_SELECT } from '../../../store/modules/other/constants'
import { createEditableStyles, FormatToolbar } from '../../common/format-toolbar'
import SizeObserver from '../../common/size-observer.vue'
import Viewport from '../../common/viewport.vue'
import { useLoadingStore } from '../../loading'
import { SECTION_NAMES } from './constants'

type withCustom = VueConstructor<Vue & { $refs: { root: HTMLElement } }>

const TOP_PADDING = 16 * 6 // 6rem
const LEFT_PADDING = 16 * 0.75 // 0.75rem = 12px

const { innerHeight, innerWidth } = useScreenObserve()

export default (Vue as withCustom).extend({
  components: {
    FormatToolbar,
    Viewport,
    SizeObserver,
  },

  setup() {
    const loadingStore = useLoadingStore()
    const handleLoad = loadingStore.waitUntil()

    return {
      handleLoad,
    }
  },

  data: () => ({
    observer: {} as ResizeObserver,
    availableHeight: 0,
    rootWidth: 747,
  }),

  computed: {
    previewPath(): unknown {
      return {
        name: 'other-preview',
        params: { clientID: this.$route.params.clientID },
      }
    },

    hasSelected(): boolean {
      const { selected } = this.section
      return !!selected
    },

    selectedSection(): string {
      const { hover, selected } = this.section

      if (!hover && !selected) {
        return 'select section'
      }

      const info = hover || selected
      const key = info.name as keyof typeof SECTION_NAMES
      return info.display || SECTION_NAMES[key]
    },

    scale(): number {
      const fullWidth = innerWidth.value * 0.6 - 2 * LEFT_PADDING
      return Math.max(this.iFrameWidth / fullWidth, 1)
    },

    iFrameWidth(): number {
      if (this.isPreviewMode) return this.rootWidth

      const { breakpoint } = this.$store.getters

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
      const { isPreviewMode, scale, articleHeight } = this
      const fullHight = Math.min(innerHeight.value, articleHeight)

      if (isSafari && isPreviewMode) return innerHeight.value

      if (isPreviewMode) return fullHight

      return fullHight * scale - TOP_PADDING
    },

    isPreviewMode(): boolean {
      return this.$store.state.preview === 'expanded'
    },

    editableStyles(): Vue {
      return createEditableStyles({
        getStyles: () => this.elementStyles,

        setStyle: (style: unknown) => {
          const { selected } = this.section
          if (!selected) {
            return
          }

          this.setElementStyle({ path: selected.path, style })
        },
      })
    },

    ...otherHelper.mapState({ section: 'section', articleHeight: 'height' }),
    ...otherHelper.mapGetters(['elementStyles']),
  },

  methods: {
    handleClickOutSide(event?: MouseEvent) {
      // If event is undefined, it mean that user click on the iframe
      if (!event) {
        return
      }
      // preview is wrap inside an iframe, so any click outside of toolbar should clear selection
      this.setSectionSelect(null)
    },

    ...otherHelper.mapActions(['setElementStyle']),

    ...otherHelper.mapMutations({
      setSectionSelect: SET_SECTION_SELECT,
    }),
  },

  watch: {
    isPreviewMode() {
      this.setSectionSelect(null)
    },
  },

  mounted() {
    this.rootWidth = this.$refs.root.clientWidth
    this.observer = new ResizeObserver(() => {
      this.rootWidth = this.$refs.root.clientWidth
    })
    this.observer.observe(this.$refs.root)
  },

  beforeDestroy() {
    this.observer.unobserve(this.$refs.root)
    this.setSectionSelect(null)
  },
})
</script>

<template>
  <div ref="root" :class="[$style.previewArea, isPreviewMode && '-mt-14']">
    <SizeObserver v-model="availableHeight" class="flex justify-center" :class="[!isPreviewMode && 'mx-3 mt-12']">
      <Viewport
        :class="$style.viewport"
        :path="previewPath"
        :width="iFrameWidth"
        :height="iFrameHeight"
        :interactive="!isPreviewMode"
        @load="handleLoad"
      />
    </SizeObserver>
    <div class="fixed" :class="[isPreviewMode ? 'top-2' : 'top-14']">
      <FormatToolbar
        class="mx-2"
        :has-selected="hasSelected"
        :section-name="selectedSection"
        :editable-styles="editableStyles"
        @click-outside="handleClickOutSide"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
.preview-area {
  @apply relative flex w-full shrink-0 flex-col;
}

.viewport {
  @apply shadow-1 h-full w-full;

  :global(.desktop) &,
  :global(.tablet) &,
  :global(.mobile) & {
    @apply h-full;
  }

  :global(.tablet) & {
    width: 768px;
  }

  :global(.mobile) & {
    max-width: 375px;
  }
}
</style>
