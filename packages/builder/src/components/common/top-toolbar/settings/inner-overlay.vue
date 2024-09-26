<script lang="ts">
export default defineComponent({
  props: ['widthofDialog'],
})
</script>

<template>
  <div class="overlay">
    <div class="overlay__container" :style="`width: ${widthofDialog}%`" v-on="$listeners">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overlay {
  @apply absolute inset-0 z-10 mx-auto mb-auto h-auto w-full bg-black bg-opacity-70;
  @apply flex items-center justify-center;

  &__container {
    @apply -z-1 fixed mx-auto my-auto overflow-hidden rounded-md bg-white;
    //  absolute inset-0 w-full h-full bg-black opacity-50 block;
    top: 38%;
    //dynamic props
    width: 26.125rem;
    max-width: 36rem;
    height: auto;
  }
}
</style>
