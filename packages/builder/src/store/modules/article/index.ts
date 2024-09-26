import type { StyleTree } from 'shared/code-generator/style-tree'
import type { Module } from 'vuex'
import type { Layout } from '../../../api'
import type { BaseStep } from '../../step'
import type { RootState } from '../../types'
import * as Sentry from '@sentry/vue'
import { convertNameToPath } from '@storipress/elements/utils/article'
import { BLOCKQUOTES } from '@storipress/templates/other-blocks/blockquote'
import { DROPCAPS } from '@storipress/templates/other-blocks/dropcap'
import delay from 'delay'
import { produce } from 'immer'

import { isEqual } from 'lodash'
import {
  assertStyleTree,
  createStyleTree,
  getOptionalNode,
  getStyleWithDefault,
  insertToTree,
  insertToTreeWithCascadeDown,
  mergeTree,
  normalizeStyles,
  pluckBreakpoint,
} from 'shared/code-generator/style-tree'
import { z } from 'zod'
import { listLayouts, updateLayout, uploadLayoutPreview } from '../../../api'
import { moveStep, pushHistory, REDO_HISTORY, UNDO_HISTORY } from '../../history'
import { AggregateStep, Step } from '../../step'
import {
  ADD_COLOR,
  CLEAR_COLOR,
  LOAD_LAYOUT,
  SET_ELEMENT_STYLE,
  SET_ELEMENT_VARIANT,
  SET_HEIGHT,
  SET_LAYOUTS,
  SET_SECTION_HOVER,
  SET_SECTION_SELECT,
  SET_TEMPLATE,
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

interface ScreenshotData {
  height: number
  width: number
  svg: string
}

const initialState = {
  layouts: [] as Layout[],
  currentLayout: {} as Layout,
  section: {
    selected: null as null | SectionInfo,
    hover: null,
  },
  template: 'nyt-one',
  height: 800,
  colors: [] as string[][],
  elements: freeze({
    dropcap: 'none',
    blockquote: 'regular',
  }),
  styles: freeze(createStyleTree('article')),
  templateStyles: freeze(createStyleTree('article')),
  // This is old style tree, which is used to restore styles when undo/redo or select back to old template
  stashedStyles: freeze<Record<string, StyleTree>>({}),
  history: {
    undo: [] as BaseStep[],
    redo: [] as BaseStep[],
  },
}

export type State = typeof initialState

const BreakpointSchema = z.object({
  xs: z.unknown(),
  md: z.unknown(),
  lg: z.unknown(),
})

type BreakpointSchema = z.infer<typeof BreakpointSchema>

const StyleTreeMetaSchema = z.object({
  dirty: z.record(BreakpointSchema.keyof()),
})

type StyleTreeMetaSchema = z.infer<typeof StyleTreeMetaSchema>

interface StyleTreeSchema {
  name: string
  styles: Record<string, BreakpointSchema>
  children: Record<string, StyleTreeSchema>
  meta?: StyleTreeMetaSchema
}

const StyleTreeSchema: z.ZodType<StyleTreeSchema> = z.lazy(() =>
  z.object({
    name: z.string(),
    styles: z.record(BreakpointSchema),
    children: z.record(StyleTreeSchema),
  }),
)

const ArticleSchema = z.object({
  template: z.string(),
  elements: z.record(z.string()),
  styles: StyleTreeSchema,
})

type ArticleSchema = z.infer<typeof ArticleSchema>

function handleBeforeunload(e: any) {
  const event = e || window.event
  /*
    Most modern browsers will no longer actually show this message,
    just their own. But to trigger it, you have to return one, so may as well make it useful.
  */
  const msg = 'Changes that you made may not be saved.'

  if (event) {
    event.returnValue = msg // IE
  }
  return msg // Everyone else
}

export const article: Module<State, RootState> = {
  namespaced: true,

  state: initialState,

  getters: {
    elementStyles(state, getters, _rootState, { breakpoint }) {
      const { selected } = state.section

      if (selected === null) {
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

    isUndoable(state) {
      return state.history.undo.length > 0
    },

    isRedoable(state) {
      return state.history.redo.length > 0
    },

    currentPageState({ template, elements, styles }, getters, rootState: any): object {
      return {
        id: rootState.route.params.id,
        template,
        data: {
          elements,
          styles,
        },
      }
    },
  },

  mutations: {
    [SET_LAYOUTS](state, layouts) {
      state.layouts = layouts
    },
    [LOAD_LAYOUT](state, layout: Layout) {
      state.currentLayout = layout

      const { data = {}, template } = layout
      const { elements = { dropcap: 'none', blockquote: 'regular' }, styles = {} } = data || {}

      state.colors = []
      state.template = template
      state.elements = freeze(elements)
      state.styles = styles.name ? freeze(assertStyleTree(styles, 'article')) : freeze(createStyleTree('article'))
      state.history = {
        undo: [],
        redo: [],
      }
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
    [ADD_COLOR](state, { path, style }) {
      if (!state.colors.some((p) => isEqual(path, p))) {
        state.colors.push(path)
      }

      state.templateStyles = produce(state.templateStyles, (draft) => {
        insertToTree(draft, path, style, 'xs')
      })
    },
    [CLEAR_COLOR](state) {
      state.colors = []
    },
    [SET_ELEMENT_VARIANT](state, val) {
      const steps: Step[] = []
      if (val.dropcap === 'none')
        state.styles = produce(
          state.styles,
          (draft) => {
            const node = getOptionalNode(draft, convertNameToPath('drop-cap'))
            if (node) {
              node.styles = {}
              if (node.meta) {
                node.meta.dirty = {}
              }
            }
          },
          (patches, inversePatches) => {
            steps.push(new Step('styles', patches, inversePatches))
          },
        )

      state.elements = produce(
        state.elements,
        (draft) => {
          Object.assign(draft, val)
        },
        (patches, inversePatches) => {
          steps.push(new Step('elements', patches, inversePatches))
        },
      )

      pushHistory(state.history, new AggregateStep(steps))
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

    async fetchLayouts({ commit }) {
      commit(SET_LAYOUTS, await listLayouts())
    },

    async loadLayout({ dispatch, state, commit }, id) {
      if (!state.layouts.some((layout) => layout.id === id)) {
        await dispatch('fetchLayouts')
      }
      const layout = state.layouts.find((layout) => layout.id === id)
      if (!layout) {
        return
      }
      commit(LOAD_LAYOUT, layout)
    },

    async uploadLayoutPreview({ dispatch }, data: { id: string; screenshot?: ScreenshotData }) {
      if (!data.screenshot) {
        return
      }
      const { svg, width, height } = data.screenshot
      const img = await createImage(svg)
      await delay(100)
      const canvas = createCanvas(img, width, height)
      const blob = await canvasToBlob(canvas)
      if (!blob) {
        return
      }
      await uploadLayoutPreview({ id: data.id, file: blob })
      window.removeEventListener('beforeunload', handleBeforeunload)
      dispatch('fetchLayouts')
    },

    async updateCurrentPage({ getters, dispatch }) {
      const { id, template, data } = getters.currentPageState

      try {
        ArticleSchema.parse(getters.currentPageState)
      } catch (error) {
        Sentry.withScope((scope) => {
          scope.setLevel('warning')
          scope.setTag('zod.type', 'article')
          Sentry.captureException(error)
        })
      }

      await updateLayout({
        id,
        template,
        data,
      })

      dispatch('fetchLayouts')
    },

    async publish({ dispatch }) {
      return await dispatch('updateCurrentPage')
    },

    undo({ commit }) {
      commit(UNDO_HISTORY)
    },
    redo({ commit }) {
      commit(REDO_HISTORY)
    },
  },
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img), { once: true })
    img.addEventListener('error', (err) => reject(err), { once: true })
    img.crossOrigin = 'anonymous'
    img.src = url
  })
}

function createCanvas(img: HTMLImageElement, width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  const ratio = window.devicePixelRatio || 1

  const canvasWidth = width
  const canvasHeight = height

  canvas.width = canvasWidth * ratio
  canvas.height = canvasHeight * ratio
  canvas.style.width = `${canvasWidth}`
  canvas.style.height = `${canvasHeight}`

  // always use white background
  context.fillStyle = '#fff'
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.drawImage(img, 0, 0, canvas.width, canvas.height)

  return canvas
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    })
  })
}
