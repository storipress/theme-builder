declare module 'tiptap-utils' {
  import type { MarkType, NodeType } from 'prosemirror-model'
  import type { ProseMirrorState } from 'tiptap'

  export function nodeIsActive(state: ProseMirrorState, ty: NodeType, attrs?: object): boolean
  export function markIsActive(state: ProseMirrorState, ty: MarkType, attrs?: object): boolean
}
