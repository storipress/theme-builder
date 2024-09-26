<script lang="ts">
import { BaseElement } from './base'
import ColorArea from './color-area.vue'

export default BaseElement.extend({
  components: { ColorArea },

  props: {
    backgroundColor: {
      type: [Boolean, String, Object],
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
  <ColorArea class="article" component="article" :background-color="color">
    <slot />
  </ColorArea>
</template>
