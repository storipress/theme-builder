<script lang="ts">
import type { PropType } from 'vue-demi'
import { ColorPickerPopup } from '@storipress/color-picker'
import { defineComponent, ref, toRef } from 'vue-demi'

import { useColorPicker } from '../../common/use-color-picker'
import { useArticleElement } from '../inject'

export default defineComponent({
  components: {
    ColorPickerPopup,
  },

  props: {
    kind: {
      type: String,
    },
    component: {
      type: String,
      default: 'div',
    },
    disabled: {
      type: Boolean,
    },
    backgroundColor: {
      type: [String, Object] as PropType<string | Record<string, unknown>>,
    },
  },

  setup(props) {
    if (props.disabled) {
      return {
        root: ref(),
        picker: ref(),
        color: '',
      }
    }

    const element = useArticleElement()

    return {
      scale: toRef(element.value, 'scale'),
      ...useColorPicker({
        element,
        prefix: 'article',
        kind: props.kind,
        backgroundColor: props.backgroundColor,
      }),
    }
  },
})
</script>

<template>
  <component :is="component" ref="root" :class="kind" v-on="$listeners">
    <slot />
    <ColorPickerPopup
      v-if="!disabled"
      ref="picker"
      v-model="color"
      class="color-picker-wrapper z-30"
      button-class="shadow-2 bg-white hover:bg-white-grey transition-colors rounded"
      style="min-width: 32px; min-height: 32px"
      :scale="scale"
    />
  </component>
</template>

<style lang="scss" scoped>
.color-picker-wrapper {
  [data-placement^='right'] & {
    @apply origin-top-right;
  }

  [data-placement^='bottom'] & {
    @apply origin-top;
  }
}
</style>
