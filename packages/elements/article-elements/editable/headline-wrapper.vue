<script lang="ts">
import { defineComponent, provide, ref } from 'vue-demi'

import { HEADLINE_TARGET } from './headline-symbol'

export default defineComponent({
  setup() {
    const root = ref<HTMLElement>()

    provide(HEADLINE_TARGET, root)

    return {
      root,
    }
  },
})
</script>

<template>
  <div ref="root">
    <slot />
  </div>
</template>
