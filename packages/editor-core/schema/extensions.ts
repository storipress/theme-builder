import type { AnyExtension } from '@tiptap/core'
import { createSchemaExtensions } from '@storipress/tiptap-schema'

import { attachEmbedNodeView } from './embed'
import { attachGalleryNodeView } from './gallery'
import { attachImageNodeView } from './image'
import { attachResourceNodeView } from './resource'

interface Enhancer {
  (node: AnyExtension): AnyExtension
}

export const baseExtensions: AnyExtension[] = createSchemaExtensions({
  image: attachImageNodeView as Enhancer,
  gallery: attachGalleryNodeView as Enhancer,
  resource: attachResourceNodeView as Enhancer,
  embed: attachEmbedNodeView as Enhancer,
})
