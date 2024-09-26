<script lang="ts">
import { BaseElement } from './base-element'

export default BaseElement.extend({
  props: {
    order: {
      type: Number,
    },

    variant: {
      type: String,
      required: true,
    },
  },

  computed: {
    classes(): unknown {
      if (this.order == null) {
        return ['hidden']
      }

      const styles: Record<string, string> = (this as any).$style
      const isTop = this.variant === 'top'
      const isBottom = this.variant === 'bottom'
      const isPreview = this.$element.isPreview

      return {
        'add-button--top': isTop,
        'add-button--bottom': isBottom,
        [styles.addButton]: true,
        [styles.addButtonTop]: isTop,
        [styles.addButtonBottom]: isBottom,
        [styles.addButtonPreview]: isPreview,
        flex: !isPreview,
        hidden: !this.isBlockSelected || isPreview || this.isInsertMode,
      }
    },

    isBlockSelected(): boolean {
      return this.order === this.$element?.selectedBlock?.order
    },

    isInsertMode(): boolean {
      return !!this.$element.insertPoint
    },
  },
})
</script>

<template>
  <div :class="classes">
    <button :class="$style.addButtonBtn" @click="$emit('click')">
      <i class="icon-plus block h-6 w-6 leading-6" />
    </button>
  </div>
</template>

<style lang="scss" module>
.add-button {
  @apply absolute w-full items-center justify-center;

  :global(.block:not(.insert-mode):hover) & {
    @apply flex;
  }

  &--top {
    @apply top-0;
  }

  &--bottom {
    @apply bottom-0;
  }

  &--preview {
    @apply border-clear-blue border-b-2;
  }

  &__btn {
    @apply shadow-1 transition-colors hover:bg-gray-200;
    @apply absolute  z-10 transform rounded-full bg-white p-2;
    @apply border-light-pale-grey border shadow-sm;

    .add-button--preview & {
      @apply scale-200;
    }
  }
}
</style>
