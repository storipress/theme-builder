import type { StyleTree } from 'shared/code-generator/style-tree'
import data from 'data'
import { freeze, produce } from 'immer'
import { createStyleTree, insertToTree } from 'shared/code-generator/style-tree'
import { reactive } from 'vue-demi'

import { normalizeWidth, SPACING_PATH } from '../utils/width'
import { getFromData } from './common/utils'

interface ElementInfo {
  path: string[]
  display: string
}

interface Store {
  styles: StyleTree
  selected: null | ElementInfo
  hasErrors: string[][]
  colors: string[][]
  requestSelect: string[] | null
  shouldStop: boolean
}

export const store: Store =
  (window as any).__STORE__ ||
  reactive({
    styles: freeze(
      insertToTree(createStyleTree(), SPACING_PATH, { width: normalizeWidth(getFromData(data, 'spacing') ?? 100) })
    ),
    selected: null,
    hasErrors: [],
    colors: [],
    requestSelect: null,
    shouldStop: false,
    reset() {
      store.styles = freeze(
        insertToTree(createStyleTree(), SPACING_PATH, { width: normalizeWidth(getFromData(data, 'spacing') ?? 100) })
      )
    },
  })

Reflect.set(window, '__STORE__', store)

interface StyleOptions {
  path: string[]
  data: Record<string, unknown>
}

interface SpacingConfig {
  width: number | string | Record<string, unknown>
  max?: number | string | Record<string, unknown>
  min?: number | string | Record<string, unknown>
}

export function setSpacing({ width, max, min }: SpacingConfig) {
  store.styles = produce(store.styles, (draft) => {
    insertToTree(draft, SPACING_PATH, {
      width: normalizeWidth(width),
      ...(max && { maxWidth: normalizeWidth(max) }),
      ...(min && { minWidth: normalizeWidth(min) }),
    })
  })
}

export function setStyle({ path, data }: StyleOptions) {
  store.styles = produce(store.styles, (draft) => {
    insertToTree(draft, path, data)
  })
}

export function addColor({ path, data }: StyleOptions) {
  setStyle({
    path,
    data,
  })
  store.colors.push([...path])
}

export function setSelected(info: null | ElementInfo) {
  store.selected = info
}
