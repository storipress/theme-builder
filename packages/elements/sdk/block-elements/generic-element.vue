<script lang="ts">
import type { PropType } from 'vue'
import { isEqual, isNil, last, omitBy } from 'lodash'

import AutoSizeInput from '../../common/auto-size-input.vue'
import { setSelected, setStyle, store } from '../store'
import { BaseElement } from './base-element'
import { styleProps } from './style-props'

export default BaseElement.extend({
  components: { AutoSizeInput },

  props: {
    component: String,
    display: String,
    path: Array as PropType<string[]>,
    editable: { type: Boolean, default: undefined },
    defaultValue: String,

    ...styleProps,
  },

  data: () => ({ text: null as null | string }),

  computed: {
    computedValue(): string {
      const value = this.text

      if (value != null) {
        return value
      }

      if (typeof this.defaultValue === 'string') {
        return this.defaultValue
      }

      return ''
    },

    isSelected(): boolean {
      return isEqual(store.selected?.path, this.path)
    },

    computedClass(): Record<string, boolean> {
      return {
        [this.kind]: true,
        'element-selected': this.isSelected,
        'element-has-error': store.hasErrors.some((path) => isEqual(path, this.path)),
      }
    },

    shouldSelected(): boolean {
      return !this.isSelected && !!store.requestSelect && isEqual(store.requestSelect, this.path)
    },

    kind(): string {
      const kind = last(this.path)
      if (!kind) {
        throw new Error('seem you forget to pass the `kind`')
      }
      return kind
    },
  },

  methods: {
    handleInput(value: string) {
      this.text = value
    },

    setSelected(event?: Event) {
      if (store.shouldStop && event) {
        event.stopPropagation()
      }
      const { path, display } = this
      setSelected({ path, display })
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
    const {
      path,
      align,
      bold,
      color,
      fontFamily,
      fontSize,
      italic,
      lineHeight,
      lowercase,
      underline,
      uppercase,
      hoverColor,
    } = this

    setStyle({
      path,
      data: omitBy(
        {
          align,
          bold,
          color,
          fontFamily,
          fontSize,
          italic,
          lineHeight,
          lowercase,
          underline,
          uppercase,
          hoverColor,
        },
        isNil
      ),
    })
  },
})
</script>

<template>
  <AutoSizeInput
    v-if="editable"
    type="textarea"
    class="element"
    :class="computedClass"
    :value="computedValue"
    @input="handleInput"
  />
  <component :is="component" v-else class="element" :class="computedClass" @click="setSelected">
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.element {
  .element-outline & {
    @apply ring ring-blue-300;
  }

  .element-outline &.element-selected {
    @apply ring-4 ring-blue-500;

    &.element-has-error {
      @apply ring-4 ring-red-500;
    }
  }

  .element-outline &.element-has-error {
    @apply ring ring-red-400;
  }
}
</style>
