import type { NodeType } from 'prosemirror-model'
// rewrite from https://github.com/ueberdosis/tiptap/blob/main/packages/tiptap-commands/src/commands/pasteRule.js
import { PasteRule } from '@tiptap/core'

export function nodePasteRule(
  regexp: RegExp,
  type: NodeType,
  getAttrs: (content: string) => Record<string, unknown> | Record<string, unknown>
) {
  return new PasteRule({
    find: regexp,
    handler: ({ match, range, state, commands }) => {
      const $from = state.doc.resolve(range.from)
      const $to = state.doc.resolve(range.to)

      if (!$from.sameParent($to)) {
        return
      }

      const node = $from.parent

      // we can't replace root
      if ($from.depth === 0) {
        return
      }

      // we only replace entire block
      if (node.textContent !== match[0]) {
        return
      }

      const blockStart = $from.index()
      const blockEnd = $to.indexAfter()
      const blockFrom = $from.start()
      const blockTo = $to.end()

      if (blockEnd - blockStart !== 1) {
        // how? we should work on single node
        return
      }

      const grandparent = $from.node($from.depth - 1)

      // finally, we check if we can replace the block
      if (grandparent.canReplaceWith(blockStart, blockEnd, type)) {
        commands.command(({ dispatch, tr }) => {
          if (dispatch) {
            dispatch(tr.replaceRangeWith(blockFrom, blockTo, type.create(getAttrs(match[0]))))
          }
          return true
        })
      }
    },
  })
}
