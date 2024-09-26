<script lang="ts">
import { stubObject } from 'lodash'
import Vue from 'vue'

export default Vue.extend({
  props: {
    height: {
      type: [Number, String, Object],
      default: stubObject,
    },
  },
})
</script>

<template>
  <nav class="nav">
    <slot />
  </nav>
</template>
