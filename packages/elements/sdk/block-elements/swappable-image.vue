<script lang="ts">
import { BlockChild } from './base-element'

export default BlockChild.extend({
  props: {
    kind: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
    },
    defaultValue: {
      type: String,
      required: true,
    },
  },

  computed: {
    src(): string {
      return this.defaultValue
    },
  },
})
</script>

<template>
  <div class="relative">
    <img class="h-full" :src="src" :alt="alt" />
  </div>
</template>
