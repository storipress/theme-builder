<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
  props: {
    circle: Boolean,
    disabled: Boolean,
    value: Boolean,
    activeClass: {
      type: String,
      default: '',
    },
  },
})
</script>

<template>
  <button
    :class="[
      $style.toggleButton,
      circle && $style.toggleButtonCircle,
      value && $style.toggleButtonActive,
      disabled && $style.toggleButtonDisabled,
    ]"
    :disabled="disabled"
    v-on="$listeners"
    @click.stop="$emit('input', !value)"
  >
    <slot />
  </button>
</template>

<style lang="scss" module>
.toggle-button {
  @apply flex h-8 w-8 items-center justify-center;

  &--circle {
    @apply rounded-full;
  }

  &--active {
    @apply text-clear-blue bg-white-grey;
  }

  &--disabled {
    @apply text-opacity-24 cursor-not-allowed;
  }
}
</style>
