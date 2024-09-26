<script lang="ts">
import type { BlockState } from '../../../store/modules/front'
import { nanoid } from 'nanoid'
import { generate } from 'shared/code-generator'

import { clickOutside } from 'shared/directives/click-outside'
import { env } from '../../../env'
import {
  COMMIT_TX,
  CREATE_BLOCK,
  DROP_BLOCK,
  frontHelpers,
  INSERT_BLOCK,
  REPLACE_BLOCK,
  ROLLBACK_TX,
  SET_HIGHLIGHT_BLOCK,
  SET_INSERT,
  SET_REPLACE_MODE,
  START_TX,
} from '../../../store/modules/front'
import Imageify from '../imageify.vue'
import SizeObserver from '../size-observer.vue'
import { BlockProvider } from './block-provider'

const isDev = env.NODE_ENV !== 'production'

export default defineComponent({
  directives: { clickOutside },
  components: { Imageify, SizeObserver, BlockProvider },

  props: {
    name: String,
    preview: String,
    component: {},
  },

  data: () => ({
    blockId: nanoid(),
    height: 800,
    isSelected: false,
    insertId: null as null | string,
  }),

  computed: {
    defaultSelected(): boolean {
      return (this.defaultHighlight && this.blockStates[this.defaultHighlight.id]?.type === this.name) || false
    },
    css(): string {
      const id = this.blockId
      const { styles } = this

      const blockClass = `b-${id}`

      if (!styles.children[blockClass]) {
        return ''
      }

      return generate(styles.children[blockClass])
    },

    currentBlock(): BlockState {
      if (this.insertId && this.blockStates[this.insertId]) {
        return this.blockStates[this.insertId]
      }

      return {} as BlockState
    },

    type(): string {
      return isDev ? this.currentBlock.type : ''
    },

    btnText(): string {
      return this.isReplaceMode ? 'replace' : 'insert'
    },

    ...frontHelpers.mapState(['insertPoint', 'styles', 'blockStates', 'isReplaceMode']),
    ...frontHelpers.mapGetters(['defaultHighlight']),
  },

  methods: {
    addBlock(name: string) {
      if (!this.insertPoint) {
        return
      }

      if (this.insertId) {
        return
      }

      this.startTX()
      this.insertId = nanoid()

      const actionName = this.isReplaceMode ? 'replaceBlock' : 'insertBlock'

      this[actionName]({
        id: this.insertId,
        position: this.insertPoint.at,
        state: {
          type: name,
          desks: ['latest'],
          colors: [],
        },
      })
      this.setHighlight({
        id: this.insertId,
        height: this.height,
      })
    },

    handleClick() {
      this.isSelected = true

      if (isDev) console.info('block type:', this.name)

      /* FIXME:
        in this page, click-outside trigger the rollbackTX via setTimeout,
        so addBlock must use setTimeout too, for keep the event order

        maybe need refactor that in future
      */
      setTimeout(() => this.addBlock(this.name), 0)
    },

    handleInsert() {
      this.insertId = null
      this.commitTX()
      this.isSelected = false
      this.setInsert(null)
      this.setHighlight(null)
      this.setReplaceMode(false)
    },

    handleClickOutside() {
      if (!this.isSelected) {
        return
      }

      this.insertId = null
      this.rollbackTX()
      this.isSelected = false
      this.setHighlight(this.defaultHighlight)
    },

    ...frontHelpers.mapMutations({
      insertBlock: INSERT_BLOCK,
      replaceBlock: REPLACE_BLOCK,
      setInsert: SET_INSERT,
      setHighlight: SET_HIGHLIGHT_BLOCK,
      setReplaceMode: SET_REPLACE_MODE,
      createBlock: CREATE_BLOCK,
      dropBlock: DROP_BLOCK,
      startTX: START_TX,
      commitTX: COMMIT_TX,
      rollbackTX: ROLLBACK_TX,
    }),
  },

  watch: {
    insertPoint(val) {
      if (val && this.defaultSelected) {
        this.handleClick()
      }
    },
  },

  created() {
    this.createBlock({
      id: this.blockId,
      state: {
        type: this.name,
        desks: ['latest'],
        colors: [],
      },
    })
  },

  beforeUnmount() {
    this.rollbackTX()
    this.dropBlock(this.blockId)
  },
})
</script>

<template>
  <div class="block-wrapper">
    <div v-click-outside="handleClickOutside" class="block-content" :class="[isSelected && 'block-active']">
      <img
        v-if="preview"
        v-image-fade-in
        class="cursor-pointer rounded-lg"
        :class="isSelected && 'opacity-40'"
        :src="preview"
        :alt="type"
        loading="lazy"
        @click="handleClick"
      />
      <Imageify
        v-else
        class="rounded-lg"
        :class="isSelected && 'opacity-40'"
        :width="1250"
        :height="height"
        @click="handleClick"
      >
        <SizeObserver v-model="height">
          <BlockProvider isolated>
            <component :is="component" :block="{ id: blockId, manager }" />
          </BlockProvider>
        </SizeObserver>
        <component is="style" type="text/css">
          {{ css }}
        </component>
      </Imageify>

      <button v-if="isSelected" class="insert" @click="handleInsert">{{ btnText }}</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.block-wrapper {
  @apply mb-2 px-2 py-2;
}

.block-content {
  @apply relative rounded-lg bg-white;

  height: max-content;
  break-inside: avoid;
  transition:
    transform 150ms ease,
    box-shadow 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 50%);

  &:hover {
    transform: scale(1.02, 1.02);
    box-shadow:
      0 4px 20px 0 rgb(0 0 0 / 30%),
      0 1px 4px 0 rgb(0 0 0 / 50%);
  }

  &--active {
    @apply z-10;

    transform: scale(1.02, 1.02);
    box-shadow:
      0 4px 20px 0 rgb(0 0 0 / 30%),
      0 1px 4px 0 rgb(0 0 0 / 50%),
      0 0 0 2px rgb(43 139 242);

    &:hover {
      box-shadow:
        0 4px 20px 0 rgb(0 0 0 / 30%),
        0 1px 4px 0 rgb(0 0 0 / 50%),
        0 0 0 2px rgb(43 139 242);
    }
  }
}

.insert {
  @apply shadow-1 absolute right-0 top-0 flex items-center rounded-sm bg-emerald-700 px-3 py-2 text-sm uppercase leading-none text-white;

  &:hover {
    @apply bg-emerald-900;
  }

  margin-top: 0.4rem;
  margin-right: 0.4rem;
}
</style>
