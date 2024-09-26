import type { Remote } from 'shared/channel'
import type { StyleTree } from 'shared/code-generator/style-tree'
import type { Module } from 'vuex'
import type { Page } from '../../../api'
import type { BaseStep } from '../../step'
import type { RootState } from '../../types'
import { redo, undo } from '@storipress/editor-core'
import { BLOCKQUOTES } from '@storipress/templates/other-blocks/blockquote'
import { DROPCAPS } from '@storipress/templates/other-blocks/dropcap'
import { produce } from 'immer'
import { isEqual } from 'lodash'

import { connectToChannel } from 'shared/channel'
import {
  assertStyleTree,
  createStyleTree,
  getStyleWithDefault,
  insertToTree,
  insertToTreeWithCascadeDown,
  mergeTree,
  normalizeStyles,
  pluckBreakpoint,
} from 'shared/code-generator/style-tree'
import { createNamespacedHelpers } from 'vuex'
import { getPages, updatePage } from '../../../api'
import { moveStep, pushHistory, REDO_HISTORY, UNDO_HISTORY } from '../../history'
import { AggregateStep, Step } from '../../step'
import {
  ADD_COLOR,
  LOAD_PAGE,
  SET_EDITOR_CONTENT,
  SET_ELEMENT_STYLE,
  SET_ELEMENT_VARIANT,
  SET_HEIGHT,
  SET_ID,
  SET_MODE,
  SET_PAGES,
  SET_SECTION_HOVER,
  SET_SECTION_SELECT,
  SET_TEMPLATE,
  SET_TEMPLATE_DATA,
  SET_TEMPLATE_STYLE,
} from './constants'

const { freeze } = Object

const VARIANT_DEFAULT: Record<string, Record<string, object>> = {
  dropcap: DROPCAPS,
  blockquote: BLOCKQUOTES,
}

const styleVariantKeyMap: Record<string, string> = {
  'drop-cap': 'dropcap',
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
  color: '#000',
  fontFamily: 'Roboto',
}

interface SectionInfo {
  name: string
  display?: string
  path: string[]
}

const DEFAULT_TEMPLATE_DATA = {
  title: '',
  description: '',
  caption: '',
  headlineURL: '',
  headlineAlt: '',
}

const initialState = {
  mode: 'design',
  pages: [] as Page[],
  currentPage: {} as Page,
  section: {
    selected: null as null | SectionInfo,
    hover: null,
  },
  id: '',
  loadedId: '',
  height: 800,
  colors: [] as string[][],
  elements: freeze({
    dropcap: 'none',
    blockquote: 'regular',
  }),
  styles: freeze(createStyleTree('article')),
  template: 'nyt-one',
  templateData: {
    ...DEFAULT_TEMPLATE_DATA,
  },
  templateStyles: freeze(createStyleTree('article')),
  stashedStyles: freeze<Record<string, StyleTree>>({}),
  editorContent: {},
  history: {
    undo: [] as BaseStep[],
    redo: [] as BaseStep[],
  },
}
export const otherHelper = createNamespacedHelpers('other')

export type State = typeof initialState

interface EditorAPI {
  undo: () => void
  redo: () => void
}

const DEFAULT_REMOTE_EDITOR: Remote<EditorAPI> = {
  undo: () => Promise.resolve(),
  redo: () => Promise.resolve(),
} as any

let remoteEditor: Remote<EditorAPI> = DEFAULT_REMOTE_EDITOR

async function buildRemoteEditorBus() {
  remoteEditor =
    (await connectToChannel({
      undo: () => undo.post(),
      redo: () => redo.post(),
    } as EditorAPI)) ?? DEFAULT_REMOTE_EDITOR
}

export const other: Module<State, RootState> = {
  namespaced: true,

  state: initialState,

  getters: {
    elementStyles(state, getters, _rootState, { breakpoint }) {
      const { selected } = state.section

      if (selected == null) {
        return DEFAULT_STYLE
      }

      const { name, path } = selected

      const variantKey = (styleVariantKeyMap[name] ?? name) as keyof typeof state.elements
      const merged = getters.mergedTree

      return pluckBreakpoint(
        normalizeStyles({
          ...DEFAULT_STYLE,
          ...VARIANT_DEFAULT[variantKey]?.[state.elements[variantKey]],
          ...getStyleWithDefault(merged, path),
        }),
        breakpoint,
      )
    },

    styleOptions(_state, getter) {
      return getter.mergedTree
    },

    mergedTree(state) {
      return mergeTree(state.templateStyles, state.styles)
    },

    isUndoable(state, getters, rootState: any) {
      return state.mode === 'edit' ? rootState.editorState.history.undo : state.history.undo.length > 0
    },

    isRedoable(state, getters, rootState: any) {
      return state.mode === 'edit' ? rootState.editorState.history.redo : state.history.redo.length > 0
    },

    currentPageState(
      { id, template, templateData, elements, styles, editorContent, currentPage },
      getters,
      rootState: any,
    ): object {
      return {
        id,
        draft: {
          template,
          templateData,
          elements,
          styles,
          editorContent,
        },
      }
    },
  },

  mutations: {
    [SET_MODE](state, format) {
      state.mode = format
    },
    [SET_PAGES](state, payload) {
      state.pages = payload
    },
    [LOAD_PAGE](state, page: Page) {
      state.currentPage = page

      // id: Scalars['ID'];
      // title?: Maybe<Scalars['String']>;
      // draft?: Maybe<Scalars['JSON']>;
      // current?: Maybe<Scalars['JSON']>;
      // seo?: Maybe<Scalars['JSON']>;
      // layout_id?: Maybe<Scalars['ID']>;

      const { draft = {}, id } = page
      const {
        template,
        templateData = {},
        styles = {},
        elements = { dropcap: 'none', blockquote: 'regular' },
        editorContent,
      } = draft || {}

      state.template = template
      state.templateData = {
        ...DEFAULT_TEMPLATE_DATA,
        ...templateData,
      }
      state.elements = freeze(elements)
      state.editorContent = editorContent
      state.styles = styles.name ? freeze(assertStyleTree(styles, 'article')) : freeze(createStyleTree('article'))
      state.history = {
        undo: [],
        redo: [],
      }
    },
    [SET_ID](state, id) {
      state.id = id
    },
    [SET_HEIGHT](state, val) {
      state.height = val
    },
    [SET_SECTION_SELECT](state, val) {
      state.section.selected = val
    },
    [SET_SECTION_HOVER](state, val) {
      state.section.hover = val
    },
    [SET_TEMPLATE](state, val) {
      const old = state.template
      const steps = [
        // immer doesn't support to generate patches for non-object
        new Step(
          'template',
          [
            {
              op: 'replace',
              path: [],
              value: val,
            },
          ],
          [
            {
              op: 'replace',
              path: [],
              value: old,
            },
          ],
        ),
      ]
      const currentStyles = state.styles
      const oldStyles = state.stashedStyles[val]
      state.styles = produce(
        state.styles,
        () => {
          return oldStyles ?? createStyleTree('article')
        },
        (patches, inversePatches) => {
          steps.push(new Step('styles', patches, inversePatches))
        },
      )

      state.stashedStyles = produce(state.stashedStyles, (draft) => {
        draft[old] = currentStyles
      })

      state.template = val
      state.templateStyles = freeze(createStyleTree('article'))
      state.colors = []
      pushHistory(state.history, new AggregateStep(steps))
    },
    [SET_TEMPLATE_DATA](state, payload) {
      state.templateData = payload.key
        ? {
            ...state.templateData,
            [payload.key]: payload.value,
          }
        : payload
    },
    [ADD_COLOR](state, { path, style }) {
      if (!state.colors.some((p) => isEqual(path, p))) {
        state.colors.push(path)
      }

      state.templateStyles = produce(state.templateStyles, (draft) => {
        insertToTree(draft, path, style, 'xs')
      })
    },
    [SET_ELEMENT_VARIANT](state, val) {
      state.elements = produce(
        state.elements,
        (draft) => {
          Object.assign(draft, val)
        },
        (patches, inversePatches) => {
          pushHistory(state.history, new Step('elements', patches, inversePatches))
        },
      )
    },
    [SET_TEMPLATE_STYLE](state, { path, style }) {
      state.templateStyles = produce(state.templateStyles, (draft) => {
        insertToTree(draft, path, style, 'xs')
      })
    },

    [SET_ELEMENT_STYLE](state, { path, style, breakpoint, skipHistory }) {
      state.styles = produce(
        state.styles,
        (draft) => {
          const insert = skipHistory ? insertToTree : insertToTreeWithCascadeDown
          insert(draft, path, style, breakpoint)
        },
        (patches, inversePatches) => {
          if (!skipHistory) {
            pushHistory(state.history, new Step('styles', patches, inversePatches))
          }
        },
      )
    },
    [SET_EDITOR_CONTENT](state, payload) {
      state.editorContent = payload
    },
    [UNDO_HISTORY](state) {
      moveStep(state, state.history.undo, state.history.redo)
    },
    [REDO_HISTORY](state) {
      moveStep(state, state.history.redo, state.history.undo)
    },
  },

  actions: {
    setElementStyle({ commit, rootGetters }, info) {
      commit(SET_ELEMENT_STYLE, { ...info, breakpoint: info.breakpoint ?? rootGetters.breakpoint })
    },

    async fetchPages({ commit }) {
      commit(SET_PAGES, await getPages())
    },

    async loadPage({ dispatch, state, commit }, id) {
      await dispatch('fetchPages')
      const page = state.pages.find((layout) => layout.id === id)
      if (!page) {
        return
      }
      commit(LOAD_PAGE, page)
    },

    async updateCurrentPage({ getters, dispatch, state, commit }) {
      const currentPage = getters.currentPageState
      if (currentPage.id && currentPage.id === state.currentPage.id) {
        await updatePage(currentPage)
      }

      return await dispatch('loadPage')
    },

    async publish({ getters }) {
      const state = {
        ...getters.currentPageState,
      }

      if (!state.id) {
        return
      }
      return await updatePage({
        ...state,
        current: getters.currentPageState.draft,
      })
    },

    async undo({ state, commit }) {
      if (state.mode === 'edit') {
        if (remoteEditor === DEFAULT_REMOTE_EDITOR) await buildRemoteEditorBus()

        remoteEditor.undo()
      } else {
        commit(UNDO_HISTORY)
      }
    },
    async redo({ state, commit }) {
      if (state.mode === 'edit') {
        if (remoteEditor === DEFAULT_REMOTE_EDITOR) await buildRemoteEditorBus()

        remoteEditor.redo()
      } else {
        commit(REDO_HISTORY)
      }
    },
  },
}
