<script lang="ts">
import { BaseElement } from './base'
import ColorArea from './color-area.vue'

export default BaseElement.extend({
  components: { ColorArea },

  props: {
    backgroundColor: [Boolean, String],
  },

  computed: {
    color(): string | null {
      const { backgroundColor: color } = this
      return color ? (color === true ? '#ffffff' : (color as string)) : null
    },
  },
})
</script>

<template>
  <ColorArea component="section" kind="article-header" :disabled="!color" :background-color="color">
    <slot />
  </ColorArea>
</template>
