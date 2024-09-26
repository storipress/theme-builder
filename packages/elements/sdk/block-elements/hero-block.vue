<script lang="ts">
import type { PropType } from 'vue'
import { generate } from 'shared/code-generator'

import { store } from '../store'
import { BaseElement } from './base-element'
import ColorArea from './color-area.vue'

const blockId = 'my-block'

export default BaseElement.extend({
  components: { ColorArea },

  props: {
    block: {
      type: Object as PropType<Record<string, unknown>>,
      required: true,
    },

    backgroundColor: {
      type: [String, Object],
    },
  },

  provide: {
    blockId,
  },

  computed: {
    blockClasses(): Record<string, unknown> {
      return {
        [`b-${blockId}`]: true,
      }
    },

    styles: () => store.styles,

    css(): string {
      return generate(this.styles)
    },
  },
})
</script>

<template>
  <ColorArea
    component="section"
    class="m-2px storipress-block relative"
    :class="blockClasses"
    :background-color="backgroundColor"
  >
    <!-- @slot block content -->
    <slot />
    <component is="style" type="text/css">
      {{ css }}
    </component>
  </ColorArea>
</template>
