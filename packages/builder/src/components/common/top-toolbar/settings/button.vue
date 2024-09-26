<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  functional: true,
  props: {
    disabled: {
      type: Boolean,
    },
  },
})
</script>

<template>
  <div class="mx-2 flex items-center justify-center">
    <button class="h-6" :disabled="disabled" v-on="$listeners">
      <slot />
    </button>
  </div>
</template>
