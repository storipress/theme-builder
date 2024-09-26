<script lang="ts">
import { Element } from './base'

export default Element.extend({
  data: () => ({
    observer: {} as ResizeObserver,
    imageClass: { 'min-h-full': true, 'min-w-full': true },
  }),
  computed: {
    headline() {
      return this.element.headlineURL
    },

    headlineAlt() {
      return this.element.headlineAlt
    },
  },

  methods: {
    updateImage() {
      const { container, img } = this.$refs as { container: HTMLElement; img: HTMLImageElement }
      const rect = container.getBoundingClientRect()
      const widthRatio = img.naturalWidth / rect.width
      const heightRatio = img.naturalHeight / rect.height
      img.style.maxHeight = img.style.maxWidth = ''
      if (img.naturalWidth > rect.width && img.naturalHeight > rect.height) {
        img.style[widthRatio > heightRatio ? 'maxHeight' : 'maxWidth'] = '100%'
      }

      if (widthRatio > heightRatio) {
        this.imageClass['min-w-full'] = false
        this.imageClass['min-h-full'] = true
      } else if (widthRatio < heightRatio) {
        this.imageClass['min-w-full'] = true
        this.imageClass['min-h-full'] = false
      }
    },
  },

  mounted() {
    const $img = this.$refs.img as HTMLImageElement
    this.observer = new ResizeObserver(() => {
      this.updateImage()
    })
    $img.addEventListener('load', () => this.updateImage())
    if ($img.complete || $img.naturalWidth > 0) {
      this.updateImage()
    }
    this.observer.observe(this.$refs.container as HTMLElement)
  },

  beforeDestroy() {
    this.observer.unobserve(this.$refs.container as HTMLImageElement)
  },
})
</script>

<template>
  <div class="headline">
    <div ref="container" class="relative h-full overflow-hidden">
      <img
        ref="img"
        class="absolute inset-0 m-auto h-auto w-auto object-cover"
        :class="imageClass"
        :src="headline"
        :alt="headlineAlt"
      />
    </div>
  </div>
</template>
