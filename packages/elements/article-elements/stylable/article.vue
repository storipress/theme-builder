<script lang="ts">
import { BaseElement } from './base'
import ColorArea from './color-area.vue'

export default BaseElement.extend({
  components: { ColorArea },

  props: {
    backgroundColor: {
      type: [Boolean, Object, String],
      default: 'ffffff',
    },
  },

  computed: {
    color(): string | null {
      const { backgroundColor: color } = this
      return color ? (color === true ? 'ffffff' : (color as string)) : null
    },
  },
})
</script>

<template>
  <ColorArea class="article pb-20" component="article" :background-color="color">
    <slot />
  </ColorArea>
</template>
