<script lang="ts">
import type { StyleTree } from 'shared/code-generator/style-tree'
import type { Component } from 'vue'
import { maps } from '@storipress/templates/blocks'
import { generate } from 'shared/code-generator'
import { assertStyleTree, STYLE_TREE_FRAGMENT } from 'shared/code-generator/style-tree'
import { mapState } from 'vuex'

import { getBlock } from '../../lib/block-loader'
import { useDataVersion } from '../../lib/data-source'
import { frontHelpers, SET_HEIGHT } from '../../store/modules/front'
import { BlockProvider } from '../common/block-previewer'
import SizeObserver from '../common/size-observer.vue'

function renderStyle(tree: StyleTree, useDeepSelector = false) {
  return generate(assertStyleTree(tree, STYLE_TREE_FRAGMENT), useDeepSelector)
}

export default defineComponent({
  components: { SizeObserver, BlockProvider },

  data: () => ({ css: '', fetchedBlocks: {} as Record<string, Component> }),

  computed: {
    blockMap(): Record<string, Component> {
      return { ...maps, ...this.fetchedBlocks }
    },

    height: {
      get(): number {
        return this.$store.state.front.height
      },

      set(val: number) {
        this.setHeight(val)
      },
    },

    version(): number {
      return useDataVersion().value
    },

    isPreviewMode(): boolean {
      return this.preview === 'expanded'
    },

    blocks(): unknown[] {
      return this.displayBlocks
    },

    ...mapState(['preview', 'clientID']),
    ...frontHelpers.mapState(['customBlocks']),
    ...frontHelpers.mapGetters({
      displayBlocks: 'displayBlocks',

      styleOptions: 'styleOptions',
    }),
  },

  methods: {
    ...frontHelpers.mapActions(['fetchDesign']),
    ...frontHelpers.mapMutations({
      setHeight: SET_HEIGHT,
    }),
  },

  watch: {
    async styleOptions(styleOptions: StyleTree) {
      this.css = renderStyle(styleOptions)
    },
    displayBlocks: {
      async handler(val: any[]) {
        const { clientID } = this as any

        const result: Record<string, Component> = {}
        for (const item of val) {
          if (item.type.includes('custom-')) {
            const id = item.type.slice(7)
            const lastModifyTime = new Date(
              this.customBlocks.data.find(({ uuid }: { uuid: string }) => uuid === id)?.updated_at,
            ).getTime()
            result[item.type] = await getBlock({ id, name: item.type, lastModifyTime }, clientID)
          }
        }
        this.fetchedBlocks = result
      },
      deep: true,
    },
  },
})
</script>

<template>
  <div>
    <BlockProvider>
      <SizeObserver v-model="height" class="blocks" :class="isPreviewMode && 'preview-mode'">
        <template v-for="(block, order) of blocks">
          <component :is="blockMap[block.type]" :key="`${block.id}_${order}`" :block="{ id: block.id, order }" />
        </template>
      </SizeObserver>
    </BlockProvider>
    <component is="style" type="text/css">
      {{ css }}
    </component>
  </div>
</template>

<style lang="scss" scoped>
.blocks {
  min-height: 48rem;

  &::v-deep {
    * {
      font-family: inherit;
    }

    .block {
      @apply font-roboto;

      .add-button--top {
        margin-top: -1px;
      }

      .add-button--bottom {
        margin-bottom: -1px;
      }

      &:first-of-type {
        .add-button--top {
          @apply hidden;
        }
      }

      &:last-of-type {
        .add-button--bottom {
          @apply hidden;
        }
      }
    }
  }
}
</style>
