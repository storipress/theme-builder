import type { VoidCtx } from 'evt'
import type { DirectiveOptions } from 'vue'
import { Evt } from 'evt'
import Vue from 'vue'

let bodyClick = Evt.create<MouseEvent>()
let windowBlur = Evt.create<FocusEvent>()

if (typeof document !== 'undefined') {
  bodyClick = Evt.from(document.body, 'click', { capture: true, passive: true }) as any
  windowBlur = Evt.from(window, 'blur', { passive: true }) as any
}

bodyClick.setMaxHandlers(100)
windowBlur.setMaxHandlers(100)

const handlers = new WeakMap<HTMLElement, VoidCtx>()

type Handler = (event?: Event) => void

export const clickOutside: DirectiveOptions = {
  bind: (el, binding, vnode) => {
    if (!binding.expression) {
      return
    }
    const ctx = Evt.newCtx()
    bodyClick.attach(ctx, (event) => {
      if (event && (el === event.target || el.contains(event.target as Node))) {
        return
      }
      const handler = (vnode.context as any)?.[binding.expression!] as Handler
      if (process.env.NODE_ENV !== 'production' && !handler) {
        Vue.util.warn(
          `v-click-outside: handler not found on context for expression ${binding.expression}`,
          vnode.context
        )
      }
      handler(event)
    })
    // https://github.com/ndelvalle/v-click-outside/issues/80
    windowBlur.attach(ctx, () => {
      setTimeout(() => {
        if (document.activeElement?.tagName === 'IFRAME') {
          const handler = (vnode.context as any)?.[binding.expression!] as Handler
          handler()
        }
      }, 0)
    })
    handlers.set(el, ctx)
  },

  unbind(el) {
    const ctx = handlers.get(el)
    handlers.delete(el)
    if (!ctx) {
      return
    }
    ctx.done()
  },
}
