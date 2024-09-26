<script lang="ts">
import { BaseElement } from './base-element'

export default BaseElement.extend({
  props: {
    full: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<template>
  <div :class="full ? null : 'spacing'">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.spacing {
  @apply mx-auto;
}
</style>
