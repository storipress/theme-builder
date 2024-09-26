import type { FloatingMenuPluginProps, FloatingMenuViewProps } from '@tiptap/extension-floating-menu'
import type { ResolvedPos } from 'prosemirror-model'
import type { EditorState } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import { posToDOMRect } from '@tiptap/core'
import { FloatingMenuView } from '@tiptap/extension-floating-menu'
import { Plugin, PluginKey } from 'prosemirror-state'

export type { FloatingMenuPluginProps }

export class HoverTriggerFloatingMenuView extends FloatingMenuView {
  currentPos?: ResolvedPos
  ignoreHover = false

  constructor({ view, element, ...options }: FloatingMenuViewProps) {
    super({ view, element, ...options })

    const dom = view.dom as HTMLElement

    dom.addEventListener('mouseover', this.handleMouseOver, { passive: true })
    element.addEventListener('mousedown', this.handleMouseDown, { passive: true, capture: true })
    document.body.addEventListener('click', this.handleClick, { capture: true, passive: true })
  }

  handleClick = (event: MouseEvent) => {
    if (this.view.dom.contains(event.target as HTMLElement) || this.element.contains(event.target as HTMLElement)) {
      return
    }
    this.hide()
  }

  handleMouseDown = () => {
    if (!this.currentPos) {
      return
    }
    this.ignoreHover = !this.ignoreHover
    const $pos = this.currentPos
    const node = $pos.node(1)
    // if node already have content, insert it at after. otherwise insert at current point
    const pos = !node.isTextblock || !node.textContent ? $pos.start(1) : $pos.end(1)
    this.editor.commands.setTextSelection(pos)
  }

  handleMouseOver = (event: MouseEvent) => {
    if (!event.target || this.ignoreHover) {
      return
    }

    this.createTooltip()
    const { tippy, view } = this
    const $pos = this.posAtCursor(event.target as Node)
    if (!$pos) {
      this.hide()
      return
    }
    // depth > 0 -> normal node
    // depth == 0 -> atom node
    const from = $pos.depth > 0 ? $pos.start(1) : $pos.pos
    const to = $pos.depth > 0 ? $pos.end(1) : from

    this.currentPos = $pos
    tippy!.setProps({
      getReferenceClientRect: () => posToDOMRect(view, from, to),
    })

    this.show()
  }

  hide = () => {
    this.ignoreHover = false
    this.currentPos = undefined
    super.hide()
  }

  update = (view: EditorView, oldState?: EditorState) => {
    this.currentPos = undefined
    super.update(view, oldState)
  }

  posAtCursor(dom: Node): ResolvedPos | void {
    const { view } = this
    const pos = view.posAtDOM(dom, 0)
    const $pos = view.state.doc.resolve(pos)
    // we probably select on an atom node, fallback to use nodeAfter
    if ($pos.depth === 0) {
      const node = $pos.nodeAfter
      if (node && node.type.isAtom) {
        // our assume is correct
        return $pos
      }
      return
    }
    const node = $pos.node(1)

    if (!node) {
      return
    }

    return $pos
  }

  destroy() {
    const { element, view, handleClick, handleMouseDown, handleMouseOver } = this
    const dom = view.dom as HTMLElement

    dom.removeEventListener('mouseover', handleMouseOver)
    element.removeEventListener('mousedown', handleMouseDown, { capture: true })
    document.body.removeEventListener('click', handleClick, { capture: true })

    super.destroy()
  }
}

export function FloatingMenuPlugin(options: FloatingMenuPluginProps) {
  return new Plugin({
    key: typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey,
    view: (view) => new HoverTriggerFloatingMenuView({ view, ...options }),
  })
}
