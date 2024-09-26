<script lang="ts">
import { setSpacing } from '../store'
import { BaseElement } from './base-element'
import Spacing from './spacing.vue'

export default BaseElement.extend({
  components: { Spacing },
  props: {
    width: {
      type: [String, Object],
      default: 'auto',
    },
    max: {
      type: [String, Object],
    },
    min: {
      type: [String, Object],
    },
  },
  created() {
    setSpacing({
      width: this.width,
      max: this.max,
      min: this.min,
    })
  },
})
</script>

<template>
  <Spacing>
    <slot />
  </Spacing>
</template>
