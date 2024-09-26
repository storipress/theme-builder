// modify from https://github.com/ueberdosis/tiptap/blob/main/packages/extension-bubble-menu/src/bubble-menu-plugin.ts

import type { Editor } from '@tiptap/core'
import type { EditorState } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import type { Instance, Props } from 'tippy.js'
import { isNodeSelection, posToDOMRect } from '@tiptap/core'
import { noop } from 'lodash'
import { Plugin, PluginKey } from 'prosemirror-state'
import tippy from 'tippy.js'

interface OnUpdateInput {
  active: boolean
  url: string
  update: (url: string) => void
  remove: () => void
}

export interface LinkEditPluginProps {
  editor: Editor
  element: HTMLElement
  tippyOptions?: Partial<Props>
  onUpdate: (input: OnUpdateInput) => void
}

export type LinkEditViewProps = LinkEditPluginProps & {
  view: EditorView
}

export class LinkEditView {
  public editor: Editor

  public element: HTMLElement

  public view: EditorView

  public preventHide = false

  public tippy!: Instance

  private _selected?: HTMLAnchorElement | null

  private onUpdate: (input: OnUpdateInput) => void

  constructor({ editor, element, view, tippyOptions, onUpdate }: LinkEditViewProps) {
    this.editor = editor
    this.element = element
    this.view = view
    this.element.addEventListener('mousedown', this.mousedownHandler, { capture: true })
    this.editor.on('focus', this.focusHandler)
    this.editor.on('blur', this.blurHandler)
    this.createTooltip(tippyOptions)
    this.element.style.visibility = 'visible'
    this.onUpdate = onUpdate ?? noop
  }

  mousedownHandler = () => {
    this.preventHide = true
  }

  focusHandler = () => {
    // we use `setTimeout` to make sure `selection` is already updated
    setTimeout(() => this.update(this.editor.view))
  }

  blurHandler = ({ event }: { event: FocusEvent }) => {
    if (this.preventHide) {
      this.preventHide = false

      return
    }

    if (event?.relatedTarget && this.element.parentNode?.contains(event.relatedTarget as Node)) {
      return
    }

    this.hide()
  }

  createTooltip(options: Partial<Props> = {}) {
    this.tippy = tippy(this.view.dom, {
      duration: 0,
      getReferenceClientRect: null,
      content: this.element,
      interactive: true,
      trigger: 'manual',
      placement: 'bottom',
      hideOnClick: 'toggle',
      ...options,
    })
  }

  update(view: EditorView, oldState?: EditorState) {
    const { state, composing } = view
    const { doc, selection } = state
    const isSame = oldState && oldState.doc.eq(doc) && oldState.selection.eq(selection)

    if (composing || isSame) {
      return
    }

    const { $anchor, ranges } = selection
    let { node } = view.domAtPos($anchor.pos)

    if (!(node instanceof HTMLAnchorElement)) {
      node = node.parentElement as HTMLElement
    }

    if (node === this._selected) {
      return
    }

    // support for CellSelections
    const from = Math.min(...ranges.map((range) => range.$from.pos))
    const to = Math.max(...ranges.map((range) => range.$to.pos))

    // Sometime check for `empty` is not enough.
    // Doubleclick an empty paragraph returns a node size of 2.
    // So we check also for an empty text size.
    if (!(node instanceof HTMLAnchorElement)) {
      this.hide()
      this._selected = undefined
      return
    }

    this._selected = node
    this.tippy.setProps({
      getReferenceClientRect: () => {
        if (isNodeSelection(view.state.selection)) {
          const node = view.nodeDOM(from) as HTMLElement

          if (node) {
            return node.getBoundingClientRect()
          }
        }

        return posToDOMRect(view, from, to)
      },
    })
    this.show()
  }

  show() {
    this.tippy.show()
    this.showEdit(this._selected!.href)
  }

  hide() {
    this.tippy.hide()
  }

  destroy() {
    this.tippy.destroy()
    this.element.removeEventListener('mousedown', this.mousedownHandler, { capture: true })
    this.editor.off('focus', this.focusHandler)
    this.editor.off('blur', this.blurHandler)
  }

  updateLink = (url: string) => {
    const view = this.view
    const pos = view.posAtDOM(this._selected as HTMLElement, 0)
    const node = view.state.doc.nodeAt(pos)
    if (node) {
      view.dispatch(
        view.state.tr
          .replaceWith(
            pos,
            pos + node.nodeSize,
            node.mark([
              ...node.marks.filter(({ type }) => type.name !== 'link'),
              view.state.schema.marks.link.create({ href: url }),
            ])
          )
          .scrollIntoView()
      )
    }
    this.hideEdit()
    this._selected = undefined
    view.focus()
  }

  removeLink = () => {
    const view = this.view
    const pos = view.posAtDOM(this._selected as HTMLElement, 0)
    const node = view.state.doc.nodeAt(pos)
    if (node) {
      view.dispatch(view.state.tr.removeMark(pos, pos + node.nodeSize, view.state.schema.marks.link).scrollIntoView())
    }
    this.hideEdit()
  }

  private showEdit(url: string) {
    const { updateLink, removeLink } = this
    this.onUpdate({
      active: true,
      url,
      update: updateLink,
      remove: removeLink,
    })
  }

  hideEdit() {
    this.onUpdate({
      active: false,
      url: '',
      update: noop,
      remove: noop,
    })
    this._selected = undefined
  }
}

export const LinkEditPluginKey = new PluginKey('linkEdit')

export function LinkEditPlugin(options: LinkEditPluginProps) {
  return new Plugin({
    key: LinkEditPluginKey,
    view: (view) => new LinkEditView({ view, ...options }),
  })
}
