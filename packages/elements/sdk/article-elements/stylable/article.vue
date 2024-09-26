<script lang="ts">
import { generate } from 'shared/code-generator'
import Vue from 'vue'

import { store } from '../../store'
import ColorArea from './color-area.vue'

export default Vue.extend({
  components: { ColorArea },

  props: {
    backgroundColor: {
      type: [Boolean, String],
      default: 'ffffff',
    },
  },

  computed: {
    color(): string | null {
      const { backgroundColor: color } = this
      return color ? (color === true ? 'ffffff' : (color as string)) : null
    },

    css(): string {
      return generate(store.styles)
    },
  },
})
</script>

<template>
  <ColorArea class="article pb-20" component="article" :background-color="color">
    <slot />
    <component is="style" type="text/css">
      {{ css }}
    </component>
  </ColorArea>
</template>
