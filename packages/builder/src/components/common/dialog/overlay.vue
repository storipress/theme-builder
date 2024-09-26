<script lang="ts">
export default defineComponent({
  props: {
    center: {
      type: Boolean,
    },
  },

  mounted() {
    document.body.style.top = `-${document.documentElement.scrollTop}px`
    document.body.classList.add('fixed')
  },

  beforeUnmount() {
    const style = document.body.style.top
    document.body.classList.remove('fixed')
    document.body.style.top = ''
    const top = Number.parseInt(style.slice(1, -3)) || 0
    requestAnimationFrame(() => {
      window.scrollTo({ left: 0, top })
    })
  },
})
</script>

<template>
  <div class="overlay" :class="[center && 'overlay--center']">
    <div class="overlay__background" v-on="$listeners" />
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.overlay {
  @apply fixed inset-0 z-50 h-full w-full;

  &--center {
    @apply flex items-center justify-center;
  }

  &__background {
    @apply absolute inset-0 h-full w-full bg-black opacity-70;

    z-index: -1;
  }
}
</style>
