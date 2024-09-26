import type { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-2'

import { stopEvent } from '../draggable-node'
import { ImageSchema } from './schema'
import ImageView from './view.vue'

export { droppedItems } from './drop-bus'

export { ImageSchema }

export function attachImageNodeView(node: Node<unknown>): Node<unknown> {
  return node.extend({
    addNodeView() {
      return VueNodeViewRenderer(ImageView, {
        stopEvent,
      })
    },
  })
}

export const Image = attachImageNodeView(ImageSchema)
