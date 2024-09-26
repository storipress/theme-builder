import type { KeyboardShortcutCommand, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-2'
import { Selection } from 'prosemirror-state'

import { EmbedSchema } from './schema'
import EmbedView from './view.vue'

export { EmbedSchema }

export function attachEmbedNodeView(node: Node<unknown>): Node<unknown> {
  return node.extend({
    addKeyboardShortcuts() {
      return {
        ArrowLeft: arrowHandler('left'),
        ArrowRight: arrowHandler('right'),
        ArrowUp: arrowHandler('up'),
        ArrowDown: arrowHandler('down'),
      }
    },

    addNodeView() {
      return VueNodeViewRenderer(EmbedView)
    },
  })
}

export const Embed = attachEmbedNodeView(EmbedSchema)

function arrowHandler(dir: 'left' | 'up' | 'right' | 'down'): KeyboardShortcutCommand {
  return ({ editor }) => {
    const { view, state, commands } = editor
    if (state.selection.empty && view.endOfTextblock(dir)) {
      const side = dir === 'left' || dir === 'up' ? -1 : 1
      const $head = state.selection.$head
      const nextPos = Selection.near(state.doc.resolve(side > 0 ? $head.after() : $head.before()), side)
      if (nextPos.$head && nextPos.$head.parent.type.name === 'embed') {
        return commands.setTextSelection(nextPos)
      }
    }
    return false
  }
}
