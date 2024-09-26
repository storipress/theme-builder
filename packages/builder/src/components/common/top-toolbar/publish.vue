<script lang="ts">
export default defineComponent({
  name: 'Publish',
})
</script>

<template>
  <button :class="$style.publishBtn">Publish</button>
</template>

<style lang="scss" module>
.publish-btn {
  @apply bg-bright-blue my-2 mr-3 py-1 text-white;

  width: 4.75rem;
  border-radius: 4px;

  &--disabled {
    @apply bg-brownish-grey;
  }
}
</style>
