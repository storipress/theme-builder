<script lang="ts">
import type { PropType } from 'vue'

import { convertNameToPath } from '../../utils/article'
import { BaseElement } from '../inject'

export default BaseElement.extend({
  props: {
    component: {
      type: String,
      required: true,
    },
    path: {
      type: Array as PropType<string[]>,
    },
    display: {
      type: String,
    },
    kind: {
      type: String,
    },
    styles: {
      type: Object,
      default: () => Object.freeze({}),
    },
    pseudoElements: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    computedPath(): string[] {
      if (this.path) {
        return this.path
      }

      return convertNameToPath(this.kind)
    },

    variants(): object {
      return this.$element.elements
    },
  },

  mounted() {
    this.$element.registerElementDefault(this.computedPath, this.styles)
  },
})
</script>

<template>
  <component :is="component" class="relative">
    <slot />
  </component>
</template>
