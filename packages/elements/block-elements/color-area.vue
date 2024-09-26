<script lang="ts">
import type { PropType } from 'vue-demi'
import { ColorPickerPopup } from '@storipress/color-picker'
import { defineComponent, inject, toRef } from 'vue-demi'

import { useColorPicker } from '../common/use-color-picker'
import { useElement } from './base-element'

export default defineComponent({
  components: { ColorPickerPopup },

  props: {
    kind: {
      type: String,
    },
    component: {
      type: String,
      default: 'div',
    },
    backgroundColor: {
      type: [String, Object] as PropType<string | Record<string, unknown>>,
    },
  },

  setup(props) {
    const blockId = inject<string>('blockId') as string
    const blockClass = `b-${blockId}`

    const element = useElement()
    return {
      scale: toRef(element.value, 'scale'),
      ...useColorPicker({
        element,
        prefix: blockClass,
        kind: props.kind,
        backgroundColor: props.backgroundColor,
      }),
    }
  },
})
</script>

<template>
  <component :is="component" ref="root" class="tippy-none" :class="kind" v-on="$listeners">
    <slot />
    <ColorPickerPopup
      ref="picker"
      v-model="color"
      class="z-30"
      button-class="shadow-2 bg-white hover:bg-white-grey transition-colors rounded"
      style="min-width: 32px; min-height: 32px"
      :scale="scale"
    />
  </component>
</template>
