<script lang="ts">
import Vue from 'vue'

import SwappableImage from './swappable-image.vue'

export default Vue.extend({
  components: { SwappableImage },
  props: {
    kind: {
      type: String,
      default: 'logo',
    },
  },

  data: () => ({
    logo: 'https://assets.stori.press/storipress/sp-placeholder.png',
  }),
})
</script>

<template>
  <SwappableImage :kind="kind" :default-value="logo" alt="logo" />
</template>
