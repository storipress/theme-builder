<script lang="ts">
import data from 'data'
import Vue from 'vue'

import { getFromData } from '../common/utils'
import SwappableImage from './swappable-image.vue'

export default Vue.extend({
  components: { SwappableImage },
  props: {
    kind: {
      type: String,
      default: 'logo',
    },
  },

  computed: {
    logo(): string {
      return getFromData(data, 'logo')
    },
  },
})
</script>

<template>
  <SwappableImage :kind="kind" :default-value="logo" />
</template>
