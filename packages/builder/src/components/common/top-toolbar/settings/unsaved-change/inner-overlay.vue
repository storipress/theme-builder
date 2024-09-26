<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({})
</script>

<template>
  <div
    class="absolute inset-0 z-50 mx-auto mb-auto flex h-auto w-full items-center justify-center bg-black bg-opacity-70"
  >
    <div class="-z-1 fixed top-[38%] mx-auto my-auto">
      <slot />
    </div>
  </div>
</template>
