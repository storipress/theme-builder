<script lang="ts">
import type { ItemDescriptor } from '@storipress/templates/blocks'
import { IdlePromise } from '@horat1us/request-idle-callback'
import { category } from '@storipress/templates/blocks'
import pEvent from 'p-event'
import { mapState } from 'vuex'

import { frontHelpers, ROLLBACK_TX, SET_HIGHLIGHT_BLOCK, SET_INSERT, SET_REPLACE_MODE } from '../../store/modules/front'
import { BlockPreview } from '../common/block-previewer'
import { PRESERVE_BLOCK_TYPE } from './constant'

interface Category {
  display: string
  key: string
}

const CATEGORIES = [
  {
    key: 'all',
    display: 'All Blocks',
  },
  {
    key: 'hero',
    display: 'Hero Header',
  },
  {
    key: 'single',
    display: 'Articles Showcase',
  },
  {
    key: 'one-row',
    display: 'Single Row',
  },
  {
    key: 'two-row',
    display: 'Double Row',
  },
  {
    key: 'mixed',
    display: 'Mixed',
  },
  {
    key: 'text',
    display: 'Text Only',
  },
  {
    key: 'subscription-box',
    display: 'Subscribe',
  },
  {
    key: 'socials',
    display: 'Socials',
  },
  {
    key: 'footer',
    display: 'Footer',
  },
  {
    key: 'code',
    display: 'Custom Code',
  },
]

const allStandardBlocks = (Object.keys(category) as (keyof typeof category)[]).flatMap((key) =>
  PRESERVE_BLOCK_TYPE.includes(key) ? [] : category[key],
)

const allBlocks = [...allStandardBlocks, ...PRESERVE_BLOCK_TYPE.flatMap((key) => category[key])]

export default defineComponent({
  components: { BlockPreview },

  props: {
    type: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    menu: 'all',
    loadPreviews: false,
  }),

  computed: {
    categories(): Category[] {
      return CATEGORIES
    },

    blockGroups(): Record<string, ItemDescriptor[]> {
      return {
        all: allStandardBlocks,
        ...category,
      }
    },

    allBlocks(): ItemDescriptor[] {
      return [...allBlocks]
    },

    matchedBlocks(): Set<string> {
      return new Set(this.blockGroups[this.menu]?.map((block) => block.name) ?? [])
    },

    ...mapState(['clientID']),
  },

  methods: {
    cancel() {
      this.menu = 'all'
      this.rollbackTX()
      this.setInsert(null)
      this.setHightlight(null)
      this.setReplaceMode(false)
    },

    async handleGroupClick(val: string) {
      this.menu = val
      await this.$nextTick()
      const previewArea = this.$refs.previewArea as HTMLElement
      previewArea.scrollTop = 0
    },

    checkIsMenuSelectable(key: string) {
      return (this.type && key === this.type) || (!this.type && !PRESERVE_BLOCK_TYPE.includes(key))
    },

    ...frontHelpers.mapMutations({
      setInsert: SET_INSERT,
      setHightlight: SET_HIGHLIGHT_BLOCK,
      setReplaceMode: SET_REPLACE_MODE,
      rollbackTX: ROLLBACK_TX,
    }),
  },
  watch: {
    type(val) {
      this.menu = val || 'all'
    },
  },

  async mounted() {
    if (document.readyState === 'loading') {
      await pEvent(document, 'load')
    }
    await IdlePromise()
    this.loadPreviews = true
  },
})
</script>

<template>
  <div class="mx-4 flex" :class="$style.blockPicker">
    <aside class="mt-16">
      <button :class="$style.backBtn" @click="cancel">
        <span class="flex items-center justify-center">
          <i class="icon-arrow_left" />
        </span>
      </button>
      <div :class="$style.blockGroups">
        <div v-for="{ display, key } in categories" :key="key" class="my-1 block w-full text-left text-sm leading-none">
          <button
            v-if="checkIsMenuSelectable(key)"
            :class="[$style.blockGroup, $style.blockHoverShadow, menu === key && 'shadow-1 bg-white']"
            @click="handleGroupClick(key)"
          >
            {{ display }}
          </button>
          <button v-else class="opacity-40" :class="[$style.blockGroup]" disabled>
            {{ display }}
          </button>
        </div>
      </div>
    </aside>
    <div class="scrollbar-hide max-h-screen pl-6 pr-3 pt-16">
      <div ref="previewArea" :class="$style.blockPreviewArea">
        <BlockPreview
          v-for="block of allBlocks"
          :key="block.name"
          :class="[$style.block, matchedBlocks.has(block.name) ? 'block' : 'hidden']"
          :name="block.name"
          :preview="block.preview"
          :component="block.component"
        />
      </div>
    </div>
    <div v-if="loadPreviews" class="hidden" aria-hidden="true">
      <img v-for="block of allBlocks" :key="block.name" alt="" :src="block.preview" />
    </div>
  </div>
</template>

<style lang="scss" module>
.block-picker {
  @apply mr-4 flex;

  color: #4c4c4c;

  > aside {
    flex: 1 0 150;
  }
}

.back-btn {
  @apply shadow-1 relative mb-4 ml-2 mt-2 flex h-10 w-10 items-center justify-center rounded-full p-2;
}

.block-groups {
  @apply shadow-1 relative mt-2 rounded-xl p-2;
}

.block-group {
  @apply inline-block rounded p-2 text-left;
}

.block-hover-shadow {
  @apply hover:shadow-1 transition-all hover:bg-white;
}

.block-preview-area {
  width: 35rem;
  columns: 17rem 2;
  column-gap: 0.5rem;
  height: stretch;
}

.block {
  break-inside: avoid;
}
</style>
