import type { Editor } from '@tiptap/core'
import type { DeferredPromise } from 'p-defer'
import type { EditorView } from 'prosemirror-view'
import type {
  PendingComment as APIPending,
  API as FullAPI,
  Note,
  NoteEdited,
  NoteRemoved,
  Pos,
  RemoveCommentParam,
  Thread,
  ThreadCreated,
} from '../../api'
import type { AnnotationState } from '../plugins/collaboration-annotation/annotation-state'

import { sortBy } from 'lodash'
import { formatDisplayTime } from 'shared/utils'
import { getAPI } from '../../api'
import { nextTick } from '../../utils'
import { AnnotationPluginKey } from '../plugins/collaboration-annotation/key'
import { getElement } from './utils'

export interface CommentPosition extends Pos {
  id: string
  draft: boolean
}

interface Listener<T, R = void> {
  (val: T): R
}

interface APIListener {
  onThreadCreated: Listener<ThreadCreated>
  onThreadResolved: Listener<Thread>
  onNoteCreated: Listener<Note>
  onNoteEdited: Listener<NoteEdited>
  onNoteRemoved: Listener<NoteRemoved>
  onPendingRemoved: Listener<APIPending>
  onThreadPositionUpdate: Listener<Record<string, Pos>, Record<string, number> | PromiseLike<Record<string, number>>>
}

interface Task {
  deferred: DeferredPromise<any>
  task: (view: Editor) => any
}

type API = Pick<FullAPI, 'createComment' | 'removeComment' | 'resolveComment' | 'createPendingComment' | 'setThreadTop'>

function createAPI({
  onNoteCreated,
  onNoteEdited,
  onNoteRemoved,
  onThreadCreated,
  onThreadResolved,
  onThreadPositionUpdate,
  onPendingRemoved,
}: APIListener): API {
  const api = getAPI()

  api.notification.onNoteCreated(onNoteCreated)
  api.notification.onNoteEdited(onNoteEdited)
  api.notification.onNoteRemoved(onNoteRemoved)
  api.notification.onThreadCreated(onThreadCreated)
  api.notification.onThreadResolved(onThreadResolved)
  api.notification.onThreadPositionUpdate(onThreadPositionUpdate)
  api.notification.onPendingRemoved(onPendingRemoved)

  const { createComment, removeComment, resolveComment, createPendingComment, setThreadTop } = api
  return { createComment, removeComment, resolveComment, createPendingComment, setThreadTop }
}

export class CommentTracker {
  private _editor!: Editor

  private handleNotifyUpdate = () => {
    this.updateComment()
  }

  private observer: ResizeObserver = new ResizeObserver(this.handleNotifyUpdate)

  private _api: API = createAPI({
    onThreadCreated: ({ id, position }) => {
      this._editor.commands.addComment(id, position.from, position.to)
    },
    onThreadResolved: ({ id }) => {
      this.withView(({ commands }) => {
        commands.deleteAnnotation(id)
      })
      this.updateComment()
    },
    onNoteCreated: this.handleNotifyUpdate,
    onNoteEdited: this.handleNotifyUpdate,
    onNoteRemoved: this.handleNotifyUpdate,
    onPendingRemoved: ({ id }) => {
      this._editor.commands.deleteAnnotation(id)
    },
    onThreadPositionUpdate: () => {
      return this.withView((editor) => {
        if (!editor) {
          return {}
        }
        const { view } = editor
        function getTop(from: number): number {
          const { node } = view.domAtPos(from)
          const element = getElement(node)
          return element.getBoundingClientRect().top
        }
        return Object.fromEntries([...this.getPositions().entries()].map(([id, item]) => [id, getTop(item.from)]))
      })
    },
  })

  constructor(editor: Editor) {
    this._editor = editor
    this.observer.observe(editor.view.dom)
  }

  resolveComment(id: string) {
    this._api.resolveComment(id)
  }

  removeComment(param: RemoveCommentParam) {
    this._api.removeComment(param)
  }

  resolveCommentAt({ id }: CommentPosition) {
    if (!id.startsWith('temp-')) {
      this.resolveComment(id)
    }
    this._editor.commands.deleteAnnotation(id)
  }

  withView<T>(task: (view: Editor) => T): T {
    return task(this._editor)
  }

  async createComment({ id, from, to }: { id: string; from: number; to: number }) {
    await nextTick()
    this.withView(({ view, commands }) => {
      const date = new Date()
      const position = { id, from, to }
      commands.addAnnotation(id, { draft: true })
      const displayTime = formatDisplayTime(date)
      this._api.createPendingComment({
        id,
        top: this.getRelativeTop(from, view.dom.getBoundingClientRect()),
        position,
        displayTime,
      })
    })
  }

  updateComment = () => {
    this.withView((editor) => {
      this._updateComment(editor.view)
    })
  }

  private async _updateComment(view: EditorView) {
    // wait for dom update
    await nextTick()
    const positions = this.getPositions()
    const tops = []
    const parentRect = view.dom.getBoundingClientRect()
    for (const pos of positions.values()) {
      try {
        tops.push({ id: pos.id, top: this.getRelativeTop(pos.from, parentRect, pos.id) })
      } catch {
        // thread data is invalid, mark is as resolve
        this.resolveComment(pos.id)
      }
    }
    this._api.setThreadTop(sortBy(tops, ({ id }) => positions.get(id)?.from))
  }

  private getRelativeTop(from: number, parentRect: DOMRect, id?: string): number {
    const { view } = this._editor
    const { node } = view.domAtPos(from)
    const paragraph = getElement(node)
    const el: HTMLElement = id ? paragraph.querySelector(`.comment[data-id="${id}"]`) || paragraph : paragraph
    const { top } = el.getBoundingClientRect()
    return top - parentRect.top
  }

  private getPositions() {
    const annotationState = AnnotationPluginKey.getState(this._editor.state) as AnnotationState
    return new Map(
      annotationState.annotations.map((decoration) => {
        const { spec, from, to } = decoration
        const { id } = spec
        return [id, { id, from, to }]
      })
    )
  }
}
