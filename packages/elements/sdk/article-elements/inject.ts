import type { VueConstructor } from 'vue'
import { constant, noop } from 'lodash'
import Vue from 'vue'

type RegisterFunction = (path: string[], props: Record<string, unknown>) => void

export interface Focus {
  x: number
  y: number
}

export interface Author {
  name: string
  url: string
}

export interface ArticleInjected {
  elements: Record<string, string>

  desk: string
  title: string
  blurb: string
  authors: Author[]
  date: Date
  headlineURL: string | null
  headlineFocus: Focus
  headlineAlt: string
  headlineCaption: string | undefined

  addColor: (info: { path: string[]; style: Record<string, unknown> }) => void
  registerElementDefault: RegisterFunction
}

export interface Injected {
  $element: ArticleInjected
}

type withInjected = VueConstructor<Vue & Injected>

export const INJECTED_DEFAULT: ArticleInjected = {
  elements: {},

  desk: '',
  title: '',
  blurb: '',
  authors: [],
  date: new Date(),
  headlineURL: null,
  headlineFocus: { x: 0, y: 0 },
  headlineAlt: '',
  headlineCaption: '',

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
