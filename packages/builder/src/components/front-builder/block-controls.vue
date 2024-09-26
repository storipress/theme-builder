<script lang="ts">
import { category } from '@storipress/templates/blocks'
import { inRange } from 'lodash'
import { computed, defineComponent } from 'vue-demi'
import { useMutations, useStore } from 'vuex-hooks'

import {
  REMOVE_BLOCK,
  SET_HIGHLIGHT_BLOCK,
  SET_INSERT,
  SET_REPLACE_MODE,
  SET_SELECTED_BLOCK,
  SWAP_BLOCK,
} from '../../store/modules/front'

const PRESERVE_BLOCK_TYPE = ['hero', 'footer']

const PRESERVE_BLOCK: Set<string> = new Set(
  PRESERVE_BLOCK_TYPE.flatMap((k) => Object.values(category[k] ?? {}).map((c) => c.name)),
)

// reverse block -> category map
const BLOCK_CATEGORY_MAP = Object.fromEntries(
  Object.entries(category).flatMap(([category, blocks]) => blocks.map((block) => [block.name, category])),
)

export default defineComponent({
  setup(_, { emit }) {
    const store = useStore()
    const mutations = useMutations('front')
    const selectedBlock = computed(() => store.getters['front/selectedBlock'])
    const blocks = computed(() => store.getters['front/displayBlocks'])
    const defaultHighlight = computed(() => store.getters['front/defaultHighlight'])

    const isFirstBlockSelected = computed(() => {
      // 0 for hero-block
      return selectedBlock.value?.order === 1
    })

    const isLastBlockSelected = computed(() => {
      if (!selectedBlock.value) {
        return false
      }

      // -1 for footer-block
      return selectedBlock.value.order + 1 === blocks.value.length - 1
    })

    function handleRemoveBlock() {
      if (!selectedBlock.value) {
        return
      }
      const { id } = selectedBlock.value
      mutations[SET_SELECTED_BLOCK](null)
      mutations[REMOVE_BLOCK](id)
    }

    function handleReplaceBlock() {
      if (!selectedBlock.value) {
        return
      }
      const { order, top, id } = selectedBlock.value
      const blockType = blocks.value.find((b: { id: string }) => b?.id === id)?.type ?? ''
      const blockPickerDefaultType = (PRESERVE_BLOCK.has(blockType) && BLOCK_CATEGORY_MAP[blockType]) || ''

      emit('set-type', blockPickerDefaultType)

      mutations[SET_REPLACE_MODE](true)
      mutations[SET_INSERT]({
        at: order,
        offset: top,
      })
      // HACK: bypass render's error
      setTimeout(() => mutations[SET_HIGHLIGHT_BLOCK](defaultHighlight.value), 200)
    }

    function handleMoveUp() {
      if (isFirstBlockSelected.value) {
        return
      }
      moveBlock(-1)
    }

    function handleMoveDown() {
      if (isLastBlockSelected.value) {
        return
      }
      moveBlock(1)
    }

    function moveBlock(direction: -1 | 1) {
      if (!selectedBlock.value) {
        return
      }
      mutations[SET_SELECTED_BLOCK]({
        ...selectedBlock.value,
        order: selectedBlock.value.order + direction,
      })

      const { id } = selectedBlock.value
      const source = blocks.value.findIndex((block: { id: string }) => block.id === id)
      const target = source + direction
      if (!inRange(target, 0, blocks.value.length)) {
        return
      }
      mutations[SWAP_BLOCK]({ pos1: source, pos2: target })
    }

    return {
      selectedBlock,
      isPreserveBlockSelected: computed(() => {
        return PRESERVE_BLOCK.has(selectedBlock.value?.type ?? 'non-exist')
      }),
      isFirstBlockSelected,
      isLastBlockSelected,

      handleRemoveBlock,
      handleReplaceBlock,
      handleMoveUp,
      handleMoveDown,
    }
  },
})
</script>

<template>
  <div class="ml-6 flex flex-col text-black text-opacity-50">
    <button
      v-show="!isPreserveBlockSelected"
      class="button shadow-1 mb-2 rounded-sm bg-white"
      :disabled="isPreserveBlockSelected"
      @click.stop="handleRemoveBlock"
    >
      <span class="flex items-center justify-center text-sm">
        <i class="icon-cross_thin" />
      </span>
    </button>

    <button class="button shadow-1 mb-2 rounded-sm bg-white" @click.stop="handleReplaceBlock">
      <span class="flex items-center justify-center">
        <i class="icon-refresh" />
      </span>
    </button>

    <div v-show="!isPreserveBlockSelected" class="shadow-1 flex flex-col overflow-hidden rounded-sm bg-white">
      <button
        class="button arrow"
        :class="{ disabled: isFirstBlockSelected }"
        :disabled="isFirstBlockSelected"
        @click.stop="handleMoveUp"
      >
        <span class="flex items-center justify-center">
          <i class="icon-up_arrow icon-arrow_up" />
        </span>
      </button>

      <button
        class="button arrow border-t"
        :class="{ disabled: isLastBlockSelected }"
        :disabled="isLastBlockSelected"
        @click.stop="handleMoveDown"
      >
        <span class="flex items-center justify-center">
          <i class="icon-down_arrow icon-arrow_down" />
        </span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.button {
  @apply h-8 w-8 transition-colors;

  &:hover {
    @apply bg-white-grey;
  }

  &.disabled,
  .disabled {
    @apply cursor-default text-gray-300;
  }
}
</style>
