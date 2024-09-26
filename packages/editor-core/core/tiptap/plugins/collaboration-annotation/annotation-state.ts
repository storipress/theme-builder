import type { EditorState, Transaction } from 'prosemirror-state'
import type * as Y from 'yjs'
import type {
  AddAnnotationAction,
  CreateAnnotationAction,
  DeleteAnnotationAction,
  UpdateAnnotationAction,
} from './collaboration-annotation'
import { isChangeOrigin } from '@tiptap/extension-collaboration'
import { Decoration, DecorationSet } from 'prosemirror-view'

import { absolutePositionToRelativePosition, relativePositionToAbsolutePosition, ySyncPluginKey } from 'y-prosemirror'
import { AnnotationItem } from './annotation-item'
import { AnnotationPluginKey } from './key'

export interface AnnotationStateOptions {
  HTMLAttributes: {
    [key: string]: any
  }
  map: Y.Map<any>
  instance: string
}

export class AnnotationState {
  options: AnnotationStateOptions

  decorations = DecorationSet.empty

  constructor(options: AnnotationStateOptions) {
    this.options = options
  }

  get annotations(): Decoration[] {
    return this.decorations.find()
  }

  findAnnotation(id: string) {
    const current = this.decorations.find()

    for (const element of current) {
      if (element.spec.id === id) {
        return element
      }
    }
  }

  addAnnotation(action: AddAnnotationAction, state: EditorState) {
    const ystate = ySyncPluginKey.getState(state)
    const { type, binding } = ystate
    const { map } = this.options
    const { id, from, to, data } = action
    const absoluteFrom = absolutePositionToRelativePosition(from, type, binding.mapping)
    const absoluteTo = absolutePositionToRelativePosition(to, type, binding.mapping)

    map.set(id, {
      from: absoluteFrom,
      to: absoluteTo,
      data,
    })
  }

  updateAnnotation(action: UpdateAnnotationAction) {
    const { map } = this.options

    const annotation = map.get(action.id)

    map.set(action.id, {
      from: annotation.from,
      to: annotation.to,
      data: { ...annotation.data, ...action.data },
    })
  }

  deleteAnnotation(id: string) {
    const { map } = this.options

    map.delete(id)
  }

  annotationsAt(position: number) {
    return this.annotationsInRange(position, position)
  }

  annotationsInRange(from: number, to: number) {
    return this.decorations.find(from, to).map((decoration) => {
      return new AnnotationItem(decoration)
    })
  }

  createDecorations(state: EditorState) {
    const { map, HTMLAttributes, instance } = this.options
    const ystate = ySyncPluginKey.getState(state)
    if (!ystate) {
      return
    }
    const { doc, type, binding } = ystate
    const decorations: Decoration[] = []

    map.forEach((annotation, id) => {
      const from = relativePositionToAbsolutePosition(doc, type, annotation.from, binding.mapping)
      const to = relativePositionToAbsolutePosition(doc, type, annotation.to, binding.mapping)

      if (!from || !to) {
        return
      }

      if (from === to) {
        console.warn(`[${instance}] corrupt decoration`, annotation.from, from, annotation.to, to)
      }

      decorations.push(
        Decoration.inline(
          from,
          to,
          { ...HTMLAttributes, 'data-id': id },
          { id, data: annotation.data, inclusiveEnd: true }
        )
      )
    })

    this.decorations = DecorationSet.create(state.doc, decorations)
  }

  apply(transaction: Transaction, state: EditorState) {
    // Add/Remove annotations
    const action = transaction.getMeta(AnnotationPluginKey) as
      | AddAnnotationAction
      | UpdateAnnotationAction
      | DeleteAnnotationAction
      | CreateAnnotationAction

    if (action && action.type) {
      if (action.type === 'addAnnotation') {
        this.addAnnotation(action, state)
      }

      if (action.type === 'updateAnnotation') {
        this.updateAnnotation(action)
      }

      if (action.type === 'deleteAnnotation') {
        this.deleteAnnotation(action.id)
      }

      if (action.type === 'createDecorations') {
        this.createDecorations(state)
      }

      return this
    }

    if (isChangeOrigin(transaction)) {
      this.createDecorations(state)

      return this
    }

    // Use ProseMirror to update positions

    this.decorations = this.decorations.map(transaction.mapping, transaction.doc)

    return this
  }
}
