<script lang="ts">
import type { PropType } from 'vue'
import { freeze } from 'immer'
import { isEqual } from 'lodash'

import { convertNameToPath } from '../../../utils/article'
import { setSelected, setStyle, store } from '../../store'
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
      default: () => freeze({}),
    },
  },

  computed: {
    computedClass(): Record<string, boolean> {
      return {
        'element-selected': this.isSelected,
        'element-has-error': store.hasErrors.some((path) => isEqual(path, this.path)),
      }
    },

    computedPath(): string[] {
      return this.path || convertNameToPath(this.kind)
    },

    isSelected(): boolean {
      return isEqual(store.selected?.path, this.path)
    },

    shouldSelected(): boolean {
      return !this.isSelected && !!store.requestSelect && isEqual(store.requestSelect, this.path)
    },
  },

  methods: {
    setSelected() {
      const { computedPath, kind } = this
      setSelected({ path: computedPath, display: kind })
    },
  },

  watch: {
    shouldSelected(val) {
      if (val) {
        this.setSelected()
        store.requestSelect = null
      }
    },
  },

  mounted() {
    setStyle({ path: this.computedPath, data: this.styles })
  },
})
</script>

<template>
  <component :is="component" class="element" :class="computedClass" @click.stop="setSelected">
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.element {
  .element-outline & {
    @apply ring ring-blue-300;

    &.element-selected {
      @apply ring-4 ring-blue-500;

      &.element-has-error {
        @apply ring-4 ring-red-500;
      }
    }

    &.element-has-error {
      @apply ring ring-red-400;
    }
  }
}
</style>
