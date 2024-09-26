<script lang="ts">
export default defineComponent({})
</script>

<template>
  <div class="relative flex items-center justify-center bg-white">
    <div :class="$style.transparency" />
    <slot />
  </div>
</template>

<style lang="scss" module>
$width: 0.5rem;
$black: #000;
$white: #fff;

@mixin fence-background($degree: 0deg) {
  @apply absolute h-full w-full;

  content: '';
  background: repeating-linear-gradient($degree, $black 0, $black $width, $white $width, $white ($width * 2));

  @content;
}

.transparency {
  @apply absolute inset-0 h-full w-full overflow-hidden opacity-25;

  &::before {
    @include fence-background();
  }

  &::after {
    @include fence-background($degree: 90deg) {
      mix-blend-mode: difference;
    }
  }
}
</style>
