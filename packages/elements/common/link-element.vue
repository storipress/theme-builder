<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    href: {
      type: String,
    },
  },
})
</script>

<template>
  <a @click.prevent><slot /></a>
</template>
