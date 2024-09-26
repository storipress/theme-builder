import type { VueConstructor } from 'vue'
import type { CommonInjected } from '../common/common-element'
import { Evt } from 'evt'
import { constant, noop } from 'lodash'
import Vue from 'vue'

import { inject, ref } from 'vue-demi'

type RegisterFunction = (path: string[], props: Record<string, unknown>) => void

type Maybe<T> = T | null

export type Events = [event: 'focus', name: string] | [event: 'preview', value: void]

interface ElementInfo {
  name: string
  display?: string
  path: string[]
}

interface ElementState {
  hover: Maybe<ElementInfo>
  selected: Maybe<ElementInfo>
}

export interface Focus {
  x: number
  y: number
}

export interface Author {
  name: string
  url: string
}

export interface FocalInfo {
  original: Focus
  url: string
}

export interface SetData<T> {
  path: string[]
  data: T
  skipHistory?: boolean
  breakpoint?: string
}

// TODO: split editable & stylable attributes?
export interface ArticleInjected extends CommonInjected {
  section: ElementState
  elements: Record<string, string>
  selectable: boolean
  editable: boolean

  title: string
  blurb: string
  desk: string
  authors: Author[]
  date: Date
  headlineURL: string | null
  headlineFocus: Focus
  headlineAlt: string
  headlineCaption: string
  editor: object | null
  profile: object
  bus: Evt<Events>

  createImageURL: (url: string, edits?: Record<string, string>) => string
  uploadImage: (file: File) => Promise<string>

  readStyle: (path: readonly string[]) => Record<string, unknown>
  setElementStyle: (payload: SetData<Record<string, unknown>>) => void
  setSectionHover: (info: ElementInfo | null) => void
  setSectionSelect: (info: ElementInfo | null) => void
  addColor: (info: { path: string[]; style: Record<string, unknown> }) => void
  registerElementDefault: RegisterFunction
}

export interface Injected {
  $element: ArticleInjected
}

type withInjected = VueConstructor<Vue & Injected>

export const INJECTED_DEFAULT: ArticleInjected = {
  section: {
    hover: null,
    selected: null,
  },
  elements: {},
  selectable: true,
  editable: false,
  scale: 1,

  site: { name: '' },
  logo: '',

  title: '',
  blurb: '',
  desk: '',
  authors: [],
  date: new Date(),
  headlineURL: null,
  headlineFocus: { x: 0, y: 0 },
  headlineAlt: '',
  headlineCaption: '',
  editor: null,
  profile: {},
  bus: Evt.create<Events>(),

  createImageURL: constant(''),
  uploadImage: constant(Promise.resolve('')),

  readStyle: constant({}),
  setElementStyle: noop,
  setSectionHover: noop,
  setSectionSelect: noop,
  addColor: noop,
  registerElementDefault: noop,
}

export const BaseElement = (Vue as withInjected).extend({
  inject: {
    $element: {
      default: constant(INJECTED_DEFAULT),
    },
  },
})

export function useArticleElement() {
  // wrap in ref to prevent auto unwrap
  return ref(inject<ArticleInjected>('$element', INJECTED_DEFAULT))
}
