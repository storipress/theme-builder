<script lang="ts">
import type { Focus } from '@storipress/image-focus'
import type { PropType } from 'vue-demi'
import { identity } from 'lodash'
import { computed, defineComponent } from 'vue-demi'

import { useFocusedImage } from './use-focused-image'

export default defineComponent({
  props: {
    alt: {
      type: String,
      default: 'image',
    },

    src: {
      type: String,
    },

    value: {
      type: Object as PropType<Focus>,
      default: (): Focus => ({ x: 0, y: 0 }),
    },
  },

  setup(props) {
    return useFocusedImage({
      extractor: identity,
      src: computed(() => props.src),
      focus: computed(() => props.value),
    })
  },
})
</script>

<template>
  <img
    ref="image"
    class="transition-position inset-0 min-h-full min-w-full max-w-none object-cover"
    :alt="alt"
    :src="src"
  />
</template>

<style lang="scss" scoped>
.transition-position {
  transition-property: top, left, bottom, right, inset;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
