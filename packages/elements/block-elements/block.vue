<script lang="ts">
import type { PropType } from 'vue-demi'
import type { BlockProp } from './use-block'
import { clickOutside } from 'shared/directives/click-outside'

import { defineComponent } from 'vue-demi'
import AddButton from './add-button.vue'
import { useArticleCountProvider } from './article-counter'
import ColorArea from './color-area.vue'
import Spacing from './spacing.vue'
import { useBlock } from './use-block'

export default defineComponent({
  components: { AddButton, ColorArea, Spacing },
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

    full: {
      type: Boolean,
      default: false,
    },

    isLazy: {
      type: Boolean,
      default: true,
    },
  },

  setup(props) {
    useArticleCountProvider(props.block?.id || '')
    return useBlock(props)
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
    :background-color="backgroundColor"
    :style="styles"
    @click="setSelected"
  >
    <AddButton :order="block.order" variant="top" @click="insertBefore" />
    <Spacing :full="full">
      <!-- @slot block content -->
      <slot />
    </Spacing>
    <AddButton :order="block.order" variant="bottom" @click="insertAfter" />
  </ColorArea>
</template>

<style lang="scss" scoped>
.highlight {
  transition: box-shadow 500ms ease-in-out 350ms;
}

.highlight-grow {
  box-shadow:
    0 1px 60px 0 rgb(0 0 0 / 10%),
    0 4px 40px 0 rgb(0 0 0 / 30%);
}
</style>
