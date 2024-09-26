<script lang="ts">
export default defineComponent({})
</script>

<template>
  <div class="w-64 text-sm">
    <div class="border-t border-black font-bold uppercase">most viewed stories</div>
    <div>
      <ol class="list">
        <li class="list__item">Title</li>
        <li class="list__item">Title</li>
      </ol>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list {
  counter-reset: item;

  &__item {
    @apply my-2;

    counter-increment: item;

    &::before {
      @apply text-red-600;

      content: counter(item) '.';
    }
  }
}
</style>
