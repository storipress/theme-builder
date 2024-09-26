<script lang="ts">
import type { State } from '../modules/virtual-viewport'
import { computed, defineComponent, onMounted, ref } from 'vue-demi'

import { useState } from 'vuex-hooks'
import { setBoundary } from './tippy-integration'

export default defineComponent({
  setup() {
    const root = ref<HTMLElement>()
    const { viewport } = useState<State>('virtualViewport')

    onMounted(() => {
      setBoundary(root.value as HTMLElement)
    })

    return {
      root,
      viewport: computed(() => {
        const documentHeight = document.body.scrollHeight
        const { top, height } = viewport.value
        const t = Number.parseInt(top)
        const h = Number.parseInt(height)
        return {
          top,
          height: t > 0 && t + h > documentHeight ? `${documentHeight - t}px` : height,
        }
      }),
    }
  },
})
</script>

<template>
  <div ref="root" :class="$style.virtualViewport" :style="viewport" />
</template>

<style lang="scss" module>
.virtual-viewport {
  @apply -z-1 pointer-events-none invisible absolute left-0 right-0 w-full;
}
</style>
