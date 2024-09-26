<script lang="ts">
import { ResponsiveImage } from '@storipress/elements/common'

import { Element } from './base'

export default Element.extend({
  components: { ResponsiveImage },
  computed: {
    headline() {
      return this.$element.headlineURL
    },

    headlineAlt() {
      return this.$element.headlineAlt
    },

    focus() {
      return this.$element.headlineFocus
    },
  },
})
</script>

<template>
  <div class="headline">
    <div class="relative h-full overflow-hidden">
      <!-- w-auto h-auto is used to prevent aspect ratio plugin affect -->
      <ResponsiveImage
        class="absolute inset-0 h-auto min-h-full w-auto min-w-full object-cover"
        :src="headline"
        :alt="headlineAlt"
        :value="focus"
      />
    </div>
  </div>
</template>
