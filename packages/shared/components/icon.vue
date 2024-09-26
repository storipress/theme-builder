<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    color: {
      default: 'currentColor',
      type: String,
    },
  },

  computed: {
    icon(): string {
      return this.$slots.default?.[0].text ?? ''
    },
  },
})
</script>

<template>
  <svg viewBox="0 0 24 24">
    <path :fill="color" :d="icon" />
  </svg>
</template>
