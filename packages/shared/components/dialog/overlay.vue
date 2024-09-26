<script lang="ts">
import Vue from 'vue'

import { raf } from '../../utils'

export default Vue.extend({
  mounted() {
    document.body.style.top = `-${document.documentElement.scrollTop}px`
    document.body.classList.add('fixed')
  },

  async beforeUnmount() {
    const style = document.body.style.top
    document.body.classList.remove('fixed')
    document.body.style.top = ''
    const top = Number.parseInt(style.slice(1, -3)) || 0
    await raf()
    window.scrollTo({ left: 0, top })
  },
})
</script>

<template>
  <div class="overlay">
    <div class="overlay__background" v-on="$listeners"></div>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.overlay {
  @apply fixed inset-0 z-20 flex h-full w-full items-center justify-center;

  &__background {
    @apply absolute inset-0 h-full w-full bg-black;

    opacity: 0.7;
    z-index: -1;
  }
}
</style>
