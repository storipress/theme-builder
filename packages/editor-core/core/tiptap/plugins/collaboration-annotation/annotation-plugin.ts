import type * as Y from 'yjs'
import { Plugin } from 'prosemirror-state'

import { AnnotationState } from './annotation-state'
import { AnnotationPluginKey } from './key'

export interface AnnotationPluginOptions {
  HTMLAttributes: {
    [key: string]: any
  }
  onUpdate: (items: [any?]) => {}
  map: Y.Map<any>
  instance: string
}

export function AnnotationPlugin(options: AnnotationPluginOptions) {
  return new Plugin({
    key: AnnotationPluginKey,

    state: {
      init() {
        return new AnnotationState({
          HTMLAttributes: options.HTMLAttributes,
          map: options.map,
          instance: options.instance,
        })
      },
      apply(transaction, pluginState, oldState, newState) {
        return pluginState.apply(transaction, newState)
      },
    },

    props: {
      decorations(state) {
        const { decorations } = this.getState(state)
        const { selection } = state

        if (!selection.empty) {
          return decorations
        }

        const annotations = this.getState(state).annotationsAt(selection.from)

        options.onUpdate(annotations)

        return decorations
      },
    },
  })
}
