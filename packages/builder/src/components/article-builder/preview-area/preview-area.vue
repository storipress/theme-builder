<script lang="ts">
import type { VueConstructor } from 'vue'
import { debounce } from 'lodash'
import invariant from 'tiny-invariant'
import Vue from 'vue'
import { mapGetters } from 'vuex'

import { useScreenObserve } from '../../../lib/use-screen-observe'
import { articleHelpers, SET_SECTION_SELECT } from '../../../store/modules/article/constants'
import { commonHelpers, SET_SCALE } from '../../../store/modules/common'
import { createEditableStyles, FormatToolbar } from '../../common/format-toolbar'
import SizeObserver from '../../common/size-observer.vue'
import Viewport from '../../common/viewport.vue'
import { useLoadingStore } from '../../loading'
import { SECTION_NAMES } from './constants'

type withCustom = VueConstructor<Vue & { $refs: { root: HTMLElement } }>

const TOP_PADDING = 16 * 6 // 6 rem
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
    previewPath(): object {
      return {
        name: 'article-preview',
        params: this.$route.params,
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
      const { isPreviewMode, iFrameWidth } = this
      if (isPreviewMode) return 1

      const fullWidth = innerWidth.value * 0.6 - 2 * LEFT_PADDING
      return Math.max(iFrameWidth / fullWidth, 1)
    },

    iFrameWidth(): number {
      if (this.isPreviewMode) return this.rootWidth

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
      const { isPreviewMode, scale, articleHeight } = this
      const fullHight = Math.min(innerHeight.value, articleHeight)

      if (isPreviewMode) return fullHight

      return fullHight * scale - TOP_PADDING
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

    ...mapGetters(['isPreviewMode', 'breakpoint']),
    ...articleHelpers.mapState({ section: 'section', articleHeight: 'height' }),
    ...articleHelpers.mapGetters(['elementStyles']),
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

    updateScale: debounce(function () {
      // @ts-expect-error
      this.setScale(this.scale)
    }, 250),

    ...articleHelpers.mapActions(['setElementStyle']),

    ...articleHelpers.mapMutations({
      setSectionSelect: SET_SECTION_SELECT,
    }),

    ...commonHelpers.mapMutations({
      setScale: SET_SCALE,
    }),
  },

  watch: {
    isPreviewMode() {
      this.setSectionSelect(null)
    },
    rootWidth() {
      this.setScale(this.scale)
    },
    breakpoint() {
      this.setScale(this.scale)
    },
  },

  mounted() {
    this.rootWidth = this.$refs.root.clientWidth
    this.observer = new ResizeObserver(() => {
      this.rootWidth = this.$refs.root.clientWidth
    })
    this.observer.observe(this.$refs.root)
    this.setScale(1)
  },

  beforeDestroy() {
    this.observer.unobserve(this.$refs.root)
    this.setSectionSelect(null)
  },
})
</script>

<template>
  <div ref="root" class="preview-area" :class="[isPreviewMode ? '-mt-14' : 'flex shrink-0 justify-center']">
    <!-- add w-full to solve safari cannot auto scale svg width bug -->
    <SizeObserver v-model="availableHeight" :class="[!isPreviewMode && 'mx-3 mt-12', breakpoint === 'lg' && 'w-full']">
      <Viewport
        class="viewport"
        :class="[!isPreviewMode && 'h-full']"
        :path="previewPath"
        :width="iFrameWidth"
        :height="iFrameHeight"
        :interactive="!isPreviewMode"
        @load="handleLoad"
      />
    </SizeObserver>
    <div class="fixed left-0" :class="[isPreviewMode ? 'top-2' : 'top-14']">
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

<style lang="scss" scoped>
.preview-area {
  @apply relative h-full w-full;
}

.viewport {
  @apply shadow-1 w-full;
}
</style>
