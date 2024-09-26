<script lang="ts" setup>
// from https://github.com/storipress/core-component/blob/master/stories/App%20Components/Snackbar/index.vue
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-50 flex items-end p-4">
    <div class="pointer-events-auto flex w-full flex-col items-center space-y-4">
      <slot />
    </div>
  </div>
</template>
