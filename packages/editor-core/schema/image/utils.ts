import type { Node as ProseMirrorNode } from 'prosemirror-model'

export function imageClass(node: ProseMirrorNode) {
  switch (node.attrs.type) {
    case 'full-width':
      return 'full'

    case 'wide':
      return 'wide'
  }
  return 'mx-auto'
}
