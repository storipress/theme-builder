import type { AnnotationState } from '../plugins/collaboration-annotation/annotation-state'
import { Extension } from '@tiptap/core'
import { constant, stubFalse } from 'lodash'

import { nanoid } from 'nanoid'
import { AnnotationPluginKey } from '../plugins/collaboration-annotation/key'
import { CommentTracker } from './comment-tracker'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    comment: {
      addDraftComment(): ReturnType
      addComment(id: string, from: number, to: number): ReturnType
      refreshComment(): ReturnType
      removeComment(id: string): ReturnType
      removeSelectComment(): ReturnType
      toggleComment(): ReturnType
    }

    commentStub: {
      addDraftComment(): ReturnType
      addComment(id: string, from: number, to: number): ReturnType
      refreshComment(): ReturnType
      removeComment(id: string): ReturnType
      removeSelectComment(): ReturnType
      toggleComment(): ReturnType
    }
  }
}

export interface CommentOptions {
  tracker: CommentTracker | null
}

export const Comment = Extension.create<CommentOptions>({
  name: 'comment',

  priority: 1000,

  addOptions() {
    return {
      // TODO: consider use extension storage
      tracker: null,
    }
  },

  onCreate() {
    this.options.tracker ??= new CommentTracker(this.editor)
  },

  onUpdate() {
    this.options.tracker?.updateComment()
  },

  addCommands() {
    const _refreshComment = () => {
      this.options.tracker?.updateComment()

      return true
    }

    const refreshComment = () => _refreshComment

    return {
      addDraftComment:
        () =>
        ({ can, commands, state, dispatch }) => {
          const { selection } = state
          if (selection.empty) {
            return false
          }

          const { from, to } = selection

          const id = `temp-${nanoid()}`
          if (!dispatch) {
            return can().addAnnotation(id, { draft: true })
          }
          const tracker = this.options.tracker as CommentTracker
          tracker.createComment({ id, from, to })
          return commands.addAnnotation(id, { draft: true })
        },
      addComment:
        (id: string, from: number, to: number) =>
        ({ chain }) => {
          return chain().addAnnotationAt(id, from, to, { draft: false }).run()
        },

      refreshComment,

      removeComment:
        (id: string) =>
        ({ commands }) =>
          commands.deleteAnnotation(id),
      removeSelectComment:
        () =>
        ({ state, dispatch }) => {
          const annotationState = AnnotationPluginKey.getState(state) as AnnotationState
          const annotations = annotationState.annotationsInRange(state.selection.from, state.selection.to)
          if (annotations.length === 0) {
            return false
          }
          const { from, to, id } = annotations[0]
          if (dispatch) {
            const tracker = this.options.tracker as CommentTracker
            tracker.resolveCommentAt({ id, from, to, draft: false })
          }
          return true
        },
      toggleComment:
        () =>
        ({ can, commands }) => {
          if (can().addDraftComment()) {
            return commands.addDraftComment()
          }
          return commands.removeSelectComment()
        },
    }
  },
})

const stubCommand = constant(stubFalse)

export const CommentStub = Extension.create({
  name: 'commentStub',

  priority: 1000,

  addCommands() {
    return {
      addDraftComment: stubCommand,
      addComment: stubCommand,
      refreshComment: stubCommand,
      removeComment: stubCommand,
      removeSelectComment: stubCommand,
      toggleComment: stubCommand,
    }
  },
})
