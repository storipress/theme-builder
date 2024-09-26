import { Component } from 'vue'
import Item0 from './source/other-page-nophoto/block/index.js'
import preview0 from './source/other-page-nophoto/preview.webp'
import Item1 from './source/spare-page-3/block/index.js'
import preview1 from './source/spare-page-3/preview.webp'

export interface ItemDescriptor {
  name: string
  component: Component
  preview: string | null
}

export { DEFAULT_TEMPLATE, Fallback } from './fallback'

export const TEMPLATE_MAP: Record<string, Component> = {
  'other-page-nophoto': Item0,
  'spare-page-3': Item1,
}

export const PREVIEW_MAP: Record<string, string> = {
  'other-page-nophoto': preview0,
  'spare-page-3': preview1,
}
