<script lang="ts">
import type { PropType } from 'vue-demi'
import type { BlockProp } from './use-block'
import { clickOutside } from 'shared/directives/click-outside'

import { defineComponent } from 'vue-demi'
import AddButton from './add-button.vue'
import { useArticleCountProvider } from './article-counter'
import ColorArea from './color-area.vue'
import { useBlock } from './use-block'

export default defineComponent({
  components: { AddButton, ColorArea },
  directives: { clickOutside },

  props: {
    /**
     * An required object for `Block`. Your block must accept a props called `block` and pass it to `Block`
     */
    block: {
      type: Object as PropType<BlockProp>,
      required: true,
    },

    backgroundColor: {
      type: [String, Object],
    },
  },

  setup(props) {
    const { insertBefore, ...blockData } = useBlock(props)
    useArticleCountProvider(props.block?.id || '')

    return blockData
  },
})
</script>

<template>
  <ColorArea
    ref="root"
    v-click-outside="handleClickOutside"
    component="section"
    class="storipress-block relative transition-shadow duration-150"
    :class="blockClasses"
    :style="styles"
    :background-color="backgroundColor"
    @click="setSelected"
  >
    <!-- @slot block content -->
    <slot />
    <AddButton :order="block.order" variant="bottom" @click="insertAfter" />
  </ColorArea>
</template>

<style lang="scss" scoped>
.highlight {
  @apply max-h-0 opacity-0;

  transition: box-shadow 500ms ease-in-out 350ms;
  animation: highlight 500ms ease-in-out forwards;
}

.highlight-grow {
  box-shadow:
    0 1px 60px 0 rgba(0, 0, 0, 0.1),
    0 4px 40px 0 rgba(0, 0, 0, 0.3);
}

@keyframes highlight {
  from {
    @apply max-h-0;
    @apply opacity-0;
  }

  50% {
    @apply max-h-256;
    @apply opacity-0;
  }

  to {
    @apply max-h-256;
    @apply opacity-100;
  }
}
</style>
