import type { Breakpoint, StyleTree } from 'shared/code-generator/style-tree'
import type { Module } from 'vuex'
import type { Desk } from '../../generated/graphql'
import type { HistoryState } from '../history'
import type { RootState } from '../types'
import type { BlockInfo, BlockState } from './types'
import * as Sentry from '@sentry/vue'
import { normalizeWidth, SPACING_PATH } from '@storipress/elements/block-elements'
import { freeze, produce } from 'immer'
import { inRange, mapValues, pick, pickBy, without } from 'lodash'
import pTimeout from 'p-timeout'

import {
  assertStyleTree,
  createStyleTree,
  filterChildren,
  getStyleWithDefault,
  insertToTree,
  insertToTreeWithCascadeDown,
  pluckBreakpoint,
  STYLE_TREE_FRAGMENT,
} from 'shared/code-generator/style-tree'
import invariant from 'tiny-invariant'
import { nextTick } from 'vue-demi'
import { createNamespacedHelpers } from 'vuex'
import { getBlocks, getDesign, listDesks, updateDesignInfo } from '../../api'
import { FrontPageSchema } from '../../lib/schemas/front'
import { ensurePath } from '../../utils/path'
import {
  COMMIT_TX,
  commitTransaction,
  createHistory,
  moveStep,
  pushHistory,
  REDO_HISTORY,
  ROLLBACK_TX,
  rollbackTransaction,
  START_TX,
  startTransaction,
  UNDO_HISTORY,
} from '../history'
import { AggregateStep, Step } from '../step'
import defaultFront from './default-front.json'
import { normalizeBlockData } from './utils/block'

export const SET_SELECTED_BLOCK = 'SET_SELECTED_BLOCK'
export const CREATE_BLOCK = 'ADD_BLOCK'
export const DROP_BLOCK = 'DROP_BLOCK'
export const INSERT_BLOCK = 'INSERT_BLOCK'
export const REMOVE_BLOCK = 'REMOVE_BLOCK'
export const REPLACE_BLOCK = 'REPLACE_BLOCK'
export const UPDATE_DESK = 'UPDATE_BLOCK'
export const SWAP_BLOCK = 'SWAP_BLOCK'
export const ADD_COLOR = 'ADD_COLOR'
export const ADD_DESK = 'ADD_DESK'
export const SET_INSERT = 'SET_INSERT'
export const SET_DESKS = 'SET_DESKS'
export const SET_HOVERED_ELEMENT = 'SET_HOVERED_ELEMENT'
export const SET_SELECTED_ELEMENT = 'SET_SELECTED_ELEMENT'
export const SET_ELEMENT_STYLE = 'SET_ELEMENT_STYLE'
export const SET_ELEMENT_TEXT = 'SET_ELEMENT_TEXT'
export const SET_ELEMENT_IMAGE = 'SET_ELEMENT_IMAGE'
export const SET_SPACING = 'SET_SPACING'
export const SET_HEIGHT = 'SET_HEIGHT'
export const SET_IMAGE_SWAP_INFO = 'SET_IMAGE_SWAP_INFO'
export const SET_HIGHLIGHT_BLOCK = 'SET_HIGHLIGHT_BLOCK'
export const SET_REPLACE_MODE = 'SET_REPLACE_MODE'
export const SET_DRAFT_DESIGN = 'SET_DRAFT_DESIGN'
export const SET_CURRENT_DESIGN = 'SET_CURRENT_DESIGN'
export const SET_CUSTOM_BLOCKS = 'SET_CUSTOM_BLOCKS'
export const SET_IS_PREVIEW_HTML = 'SET_IS_PREVIEW_HTML'

// HACK: when detect abnormal article filling, we can use this to force refresh
export const OVERRIDE_BLOCKS = 'OVERRIDE_BLOCKS'

export { COMMIT_TX, REDO_HISTORY, ROLLBACK_TX, START_TX, UNDO_HISTORY }

export const frontHelpers = createNamespacedHelpers('front')

interface ImageSwapInfo {
  path: string[]
}

interface UpdateDeskPayload {
  id: string
  order: number
  desk: string
}

interface BlockInsertPayload {
  id: string
  state: Partial<BlockState> & { type: string }
  position: number
  skipHistory: boolean
}

interface BlockReplacePayload {
  id: string
  state: BlockState
  position: number
}

export interface ElementInfo {
  path: string[]
  display: string
}

interface SpacingConfig {
  width: string | Record<string, unknown>
  max?: string | Record<string, unknown>
  min?: string | Record<string, unknown>
}

type BlockData<T> = Record<string, Record<string, T>>

interface SetDataPayload<T> {
  path: string[]
  data: T
  breakpoint?: keyof Breakpoint
  skipHistory?: boolean
  noOverride?: boolean
}
interface AddDeskPayload {
  id: string
  order: number
}

export interface HighlightInfo {
  id: string
  height: number
}

export interface InsertInfo {
  at: number
  offset: number
}

const DEFAULT_STYLE = {
  fontSize: 16,
  lineHeight: 1.5,
  align: 'left',
  bold: false,
  italic: false,
  underline: false,
  uppercase: false,
  lowercase: false,
  color: '#000000',
  fontFamily: 'Roboto',
}

const KEEP_IMAGE_KEYS = ['logo']

const initialState = {
  selectedBlockInfo: null as null | BlockInfo,
  selectedElement: null as null | ElementInfo,
  hoveredElement: null as null | ElementInfo,

  currentDesign: {},
  desks: [] as Desk[],
  height: 512,
  // a version number to notify some special elements that they need to update, currently it's used for SpacingProvider
  version: 0,

  blockStates: freeze<Record<string, BlockState>>({}),
  blocks: freeze<string[]>([]),
  // This object may be frequently add or remove property, and this will need to use `Vue.set` & `Vue.delete` to achieve this
  // Here try another approach, use a frozen object and replace it every time
  styles: freeze(createStyleTree()),
  images: freeze<BlockData<string>>({}),
  texts: freeze<BlockData<string>>({}),

  // preview may need to isolated in iframe, so we use store to pass the insert position
  insertPoint: null as InsertInfo | null,
  isReplaceMode: false,
  isPreviewHtml: false,
  highlightedBlock: null as HighlightInfo | null,
  imageSwapInfo: null as ImageSwapInfo | null,

  history: createHistory(),
  customBlocks: {},
}

export type State = typeof initialState

function getCurrentPageState({ blocks, blockStates, styles, images, texts }: State): object {
  const existBlockId = new Set(blocks)
  const existBlocks = new Set(blocks.map((block) => `b-${block}`))
  const isExistBlock = (_: unknown, key: string) => key.startsWith('@@') || key === 'spacing' || existBlocks.has(key)
  const currentStyles = filterChildren(styles, (key) => existBlocks.has(key))
  return {
    blockStates: pickBy(blockStates, (_, id) => existBlockId.has(id)),
    blocks,
    styles: assertStyleTree(currentStyles),
    images: pickBy(images, isExistBlock),
    texts: pickBy(texts, isExistBlock),
  }
}

export const front: Module<State, RootState> = {
  namespaced: true,

  state: initialState,

  getters: {
    logo(state): string {
      const [heroID] = state.blocks
      if (!heroID) {
        return ''
      }
      return state.images[`b-${heroID}`]?.logo ?? ''
    },

    displayBlocks(state) {
      return state.blocks.map((id) => {
        invariant(state.blockStates[id])
        return {
          id,
          ...state.blockStates[id],
        }
      })
    },

    selectedBlock(state): (BlockInfo & BlockState) | undefined {
      if (state.selectedBlockInfo) {
        const { id } = state.selectedBlockInfo
        invariant(state.blockStates[id])

        return {
          ...state.selectedBlockInfo,
          ...state.blockStates[id],
        }
      }
    },

    elementStyles(state, _getters, _rootState, rootGetters) {
      if (!state.selectedElement) {
        return DEFAULT_STYLE
      }

      const { path } = state.selectedElement

      return {
        ...DEFAULT_STYLE,
        ...pluckBreakpoint(getStyleWithDefault(state.styles, path), rootGetters.breakpoint),
      }
    },

    styleOptions(state) {
      return state.styles
    },

    isUndoable(state) {
      return state.history.undo.length > 0
    },

    isRedoable(state) {
      return state.history.redo.length > 0
    },

    // These values will affect the order of preview articles
    // We create a getter here for better watching changes
    shouldRepopulateValues(state) {
      return {
        // blocks order
        blocks: state.blocks,
        // desk
        desks: state.blocks.map((key) => state.blockStates[key].desks),
      }
    },

    defaultHighlight(state): HighlightInfo | null {
      return state.isReplaceMode && typeof state.insertPoint?.at === 'number'
        ? { id: state.blocks[state.insertPoint?.at], height: 800 }
        : null
    },
  },

  mutations: {
    [SET_SELECTED_BLOCK](state, info) {
      state.selectedBlockInfo = info
    },

    [START_TX](state) {
      startTransaction(state.history)
    },

    [COMMIT_TX](state) {
      commitTransaction(state.history)
    },

    [ROLLBACK_TX](state) {
      rollbackTransaction(state, state.history)
    },

    [SET_DESKS](state, desks: Desk[]) {
      state.desks = desks
    },

    [CREATE_BLOCK](state, { id, state: blockState }: Pick<BlockInsertPayload, 'id' | 'state'>) {
      if (state.blockStates[id]) {
        return
      }

      state.blockStates = produce(state.blockStates, (draft) => {
        draft[id] = {
          desks: [],
          ...blockState,
        }
      })
    },

    [DROP_BLOCK](state, id) {
      if (!state.blockStates[id]) {
        return
      }

      state.blockStates = produce(state.blockStates, (draft) => {
        Reflect.deleteProperty(draft, id)
      })

      state.styles = produce(state.styles, (draft) => {
        Reflect.deleteProperty(draft.children, id)
      })

      state.texts = produce(state.texts, (draft) => {
        Reflect.deleteProperty(draft, id)
      })

      state.images = produce(state.images, (draft) => {
        Reflect.deleteProperty(draft, id)
      })
    },

    [INSERT_BLOCK](state, { id, position, state: blockState, skipHistory }: BlockInsertPayload) {
      if (state.blockStates[id]) {
        return
      }

      const steps: Step[] = []

      state.blockStates = produce(
        state.blockStates,
        (draft) => {
          draft[id] = {
            desks: [],
            ...blockState,
          }
        },
        (patches, inversePatches) => {
          steps.push(new Step('blockStates', patches, inversePatches))
        },
      )

      state.blocks = produce(
        state.blocks,
        (draft) => {
          return insert(draft, position, id)
        },
        (patches, inversePatches) => {
          steps.push(new Step('blocks', patches, inversePatches))
        },
      )

      if (!skipHistory) {
        pushHistory(state.history, new AggregateStep(steps))
      }
    },

    [REMOVE_BLOCK](state, id: string) {
      const steps: Step[] = []

      state.blocks = produce(
        state.blocks,
        (draft) => {
          return without(draft, id)
        },
        (patches, inversePatches) => {
          steps.push(new Step('blocks', patches, inversePatches))
        },
      )

      state.blockStates = produce(
        state.blockStates,
        (draft) => {
          Reflect.deleteProperty(draft, id)
        },
        (patches, inversePatches) => {
          steps.push(new Step('blockStates', patches, inversePatches))
        },
      )

      pushHistory(state.history, new AggregateStep(steps))
    },

    [REPLACE_BLOCK](state, { id, position, state: blockState }: BlockReplacePayload) {
      if (state.blockStates[id]) {
        return
      }

      const isSelectHero = position === 0
      const steps: Step[] = []

      state.blockStates = produce(
        state.blockStates,
        (draft) => {
          draft[id] = blockState
        },
        (patches, inversePatches) => {
          steps.push(new Step('blockStates', patches, inversePatches))
        },
      )

      const oldId = `b-${state.blocks[position]}`
      state.images = produce(
        state.images,
        (draft) => {
          if (draft[oldId]) {
            draft[`b-${id}`] = pick(draft[oldId], KEEP_IMAGE_KEYS)
          }

          if (isSelectHero) {
            Reflect.deleteProperty(draft, '@@portal')
          }
        },
        (patches, inversePatches) => {
          steps.push(new Step('images', patches, inversePatches))
        },
      )

      if (isSelectHero) {
        state.texts = produce(
          state.texts,
          (draft) => {
            Reflect.deleteProperty(draft, '@@portal')
          },
          (patches, inversePatches) => {
            steps.push(new Step('texts', patches, inversePatches))
          },
        )
      }

      state.blocks = produce(
        state.blocks,
        (draft) => {
          return replace(draft, position, id)
        },
        (patches, inversePatches) => {
          steps.push(new Step('blocks', patches, inversePatches))
        },
      )

      pushHistory(state.history, new AggregateStep(steps))
    },

    [SET_SPACING](state, { width, max, min }: SpacingConfig) {
      state.styles = produce(
        state.styles,
        createHandleStyle(
          SPACING_PATH,
          {
            width: normalizeWidth(width),
            ...(max && { maxWidth: normalizeWidth(max) }),
            ...(min && { minWidth: normalizeWidth(min) }),
          },
          'xs',
          true,
        ),
      )
    },

    [SET_IMAGE_SWAP_INFO](state, info: ImageSwapInfo | null) {
      state.imageSwapInfo = info
    },

    [UPDATE_DESK](state, { id, order, desk }: UpdateDeskPayload) {
      if (!state.blockStates[id]) {
        return
      }

      state.blockStates = produce(
        state.blockStates,
        (draft) => {
          draft[id].desks[order] = desk
        },
        (patches, inversePatches) => {
          pushHistory(state.history, new Step('blockStates', patches, inversePatches))
        },
      )
    },

    [ADD_DESK](state, { id, order }: AddDeskPayload) {
      if (!state.blockStates[id] || state.blockStates[id].desks[order]) {
        return
      }

      state.blockStates = produce(state.blockStates, (draft) => {
        draft[id].desks[order] = 'latest'
      })
    },

    [SWAP_BLOCK](state, { pos1, pos2 }: { pos1: number; pos2: number }) {
      const { blocks } = state
      invariant(inRange(pos1, 0, blocks.length), 'pos1 not in range')
      invariant(inRange(pos2, 0, blocks.length), 'pos2 not in range')

      state.blocks = produce(
        blocks,
        (draft) => {
          const tmp = draft[pos1]
          draft[pos1] = draft[pos2]
          draft[pos2] = tmp
        },
        (patches, inversePatches) => {
          pushHistory(state.history, new Step('blocks', patches, inversePatches))
        },
      )
    },

    [SET_HEIGHT](state, height: number) {
      // HACK: workaround for incorrect size
      state.height = height + 5
    },

    [SET_IS_PREVIEW_HTML](state, isPreviewHtml: boolean) {
      state.isPreviewHtml = isPreviewHtml
    },

    [SET_INSERT](state, info: InsertInfo | null) {
      state.insertPoint = info
    },

    [SET_HIGHLIGHT_BLOCK](state, info: HighlightInfo | null) {
      state.highlightedBlock = info
    },

    [SET_HOVERED_ELEMENT](state, info: ElementInfo | null) {
      state.hoveredElement = info
    },

    [SET_SELECTED_ELEMENT](state, info: ElementInfo | null) {
      state.selectedElement = info
    },

    [SET_ELEMENT_STYLE](state, { path, data, breakpoint, skipHistory }: SetDataPayload<Record<string, unknown>>) {
      state.styles = produce(
        state.styles,
        createHandleStyle(path, data, breakpoint, skipHistory),
        (patches, inversePatches) => {
          if (!skipHistory) {
            pushHistory(state.history, new Step('styles', patches, inversePatches))
          }
        },
      )
    },

    [SET_ELEMENT_TEXT](state, payload: SetDataPayload<string>) {
      state.texts = setData(state.texts, payload, 'texts', state.history)
    },

    [SET_ELEMENT_IMAGE](state, payload: SetDataPayload<string>) {
      state.images = setData(state.images, payload, 'images', state.history)
    },

    [SET_REPLACE_MODE](state, payload: boolean) {
      state.isReplaceMode = payload
    },

    [UNDO_HISTORY](state) {
      moveStep(state, state.history.undo, state.history.redo)
    },

    [REDO_HISTORY](state) {
      moveStep(state, state.history.redo, state.history.undo)
    },

    [SET_DRAFT_DESIGN](state, payload: any) {
      state.blockStates = freeze(mapValues(payload?.blockStates ?? {}, (state) => ({ desks: [], ...state })))
      state.styles = assertStyleTree(payload?.styles, STYLE_TREE_FRAGMENT)
      state.images = freeze(payload?.images ?? {})
      state.texts = freeze(payload?.texts ?? {})

      // This must be the last one as it will trigger blocks update
      state.blocks = freeze(payload?.blocks ?? [])
      state.version += 1
    },

    [SET_CURRENT_DESIGN](state, payload: any) {
      state.currentDesign = payload
    },

    [SET_CUSTOM_BLOCKS](state, payload: any) {
      // TODO: merge with existing custom blocks
      state.customBlocks = payload
    },

    [OVERRIDE_BLOCKS](state, blocks: string[]) {
      state.blocks = blocks
    },
  },

  actions: {
    setElementStyle({ commit, rootGetters }, info) {
      commit(SET_ELEMENT_STYLE, { ...info, breakpoint: info.breakpoint ?? rootGetters.breakpoint })
    },

    async refreshBlocks({ commit, state }) {
      const blocks = state.blocks
      commit(OVERRIDE_BLOCKS, [])
      await nextTick()
      commit(OVERRIDE_BLOCKS, blocks)
    },

    async listDesks({ commit }) {
      commit(SET_DESKS, await listDesks())
    },

    async fetchDesign({ commit, state }, payload = {}) {
      function setDefault() {
        if (state.blocks.length > 0) {
          return
        }
        commit(SET_DRAFT_DESIGN, defaultFront)
      }

      // this will minimal the dom updating as rendering blocks is a heavy operation
      // and we don't want to slow down the initial render
      // we do this by setting the initial state only if API isn't respond in time
      async function fetchDesign() {
        const { key = 'home' } = payload
        const { draft, current = {} } = await pDefault(getDesign(key), {} as any)
        if (draft && draft.blocks?.length > 0) {
          commit(SET_DRAFT_DESIGN, normalizeBlockData(draft))
        } else {
          setDefault()
        }
        commit(SET_CURRENT_DESIGN, current)
      }

      try {
        await pTimeout(fetchDesign(), 2000)
      } catch (error) {
        if (error instanceof pTimeout.TimeoutError) {
          setDefault()
        }
      }
    },

    async fetchCustomBlocks({ commit }, payload = {}) {
      const { blocks } = await getBlocks(payload)
      commit(SET_CUSTOM_BLOCKS, blocks)
    },

    async updateCurrentPage({ state }, payload = {}) {
      const { key = 'home', seo } = payload
      const currentPage = getCurrentPageState(state)

      try {
        FrontPageSchema.parse(currentPage)
      } catch (error) {
        Sentry.withScope((scope) => {
          scope.setLevel('warning')
          scope.setTag('zod.type', 'front')
          Sentry.captureException(error)
        })
      }

      return await updateDesignInfo(key, seo, currentPage)
    },

    async publish({ dispatch, state }, payload = {}) {
      const { key = 'home', seo } = payload

      const currentPage = getCurrentPageState(state)
      await updateDesignInfo(key, seo, currentPage, currentPage)
      return dispatch('fetchDesign')
    },

    undo({ commit }) {
      commit(UNDO_HISTORY)
    },
    redo({ commit }) {
      commit(REDO_HISTORY)
    },
  },
}

function createHandleStyle(
  path: string[],
  data: Record<string, unknown>,
  breakpoint?: 'xs' | 'md' | 'lg',
  skipHistory: boolean = false,
): (styles: StyleTree) => void {
  return (draft: StyleTree) => {
    const insert = skipHistory ? insertToTree : insertToTreeWithCascadeDown
    insert(draft, path, data, breakpoint, skipHistory)
  }
}

function insert<T>(array: T[], position: number, element: T): T[] {
  return [...array.slice(0, position), element, ...array.slice(position)]
}

function replace<T>(array: T[], position: number, element: T): T[] {
  return [...array.slice(0, position), element, ...array.slice(position + 1)]
}

async function pDefault<T>(promise: PromiseLike<T | null | undefined>, def: T): Promise<T> {
  const res = await promise
  return res ?? def
}

function setData<D>(
  source: Record<string, any>,
  { path, noOverride = false, skipHistory = false, data }: SetDataPayload<D>,
  historyKey: string,
  history: HistoryState,
): Record<string, any> {
  return produce(
    source,
    (draft) => {
      const [last, parent] = ensurePath(path, draft)

      if (parent[last] && noOverride) {
        return
      }

      parent[last] = data
    },
    (patches, inversePatches) => {
      if (!skipHistory) {
        pushHistory(history, new Step(historyKey, patches, inversePatches))
      }
    },
  )
}
