<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({})
</script>

<template>
  <form @submit.prevent>
    <slot />
  </form>
</template>
