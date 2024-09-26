import type { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-2'

import { stopEvent } from '../draggable-node'
import { nodePasteRule } from './node-paste-rule'
import { ResourceSchema } from './schema'
import ResourceView from './view.vue'

const URL_REGEX = /https?:\/\/(?:www\.)?[\w#%+.:=@~-]{1,256}\.[a-z]{2,}\b[\w#%&+,./:=?@~-]*/gi

const EMBED_REGEXES = [
  /youtube\.com\/watch/,
  /twitter\.com\/[^/]+\/status/,
  /instagram\.com\/p/,
  /vimeo\.com\/\d+/,
  /codepen\.io\/[^/]+\/pen/,
  // eslint-disable-next-line security/detect-unsafe-regex
  /soundcloud\.com(?:\/[^/]+){2}/,
]

export { ResourceSchema }

export function attachResourceNodeView(node: Node<unknown>): Node<unknown> {
  return node.extend({
    addPasteRules() {
      const { type } = this
      return [
        nodePasteRule(URL_REGEX, type, (match: string) => {
          if (EMBED_REGEXES.some((regex) => regex.test(match))) {
            return {
              type: 'embed',
              url: match,
            }
          }
          return {
            type: 'bookmark',
            url: match,
          }
        }),
      ]
    },
    addNodeView() {
      return VueNodeViewRenderer(ResourceView, { stopEvent })
    },
  })
}

export const Resource = attachResourceNodeView(ResourceSchema)
