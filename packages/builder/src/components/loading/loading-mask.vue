<script lang="ts">
import { defineComponent } from 'vue-demi'

import { useLoadingStore } from './loading-store'
import Spinner from './spinner.vue'

export default defineComponent({
  components: { Spinner },
  setup() {
    const store = useLoadingStore()
    return { store }
  },
})
</script>

<template>
  <div :class="store.isMasked && 'pointer-events-none'">
    <slot />
    <Transition leave-active-class="bg-opacity-80" leave-to-class="bg-opacity-0">
      <div
        v-if="store.isSpinning || store.hasError"
        class="bg-white-grey pointer-events-none fixed inset-0 flex h-full w-full items-center justify-center transition duration-300"
      >
        <Spinner show :tip="store.tip" />
      </div>
    </Transition>
  </div>
</template>
