// From https://github.com/shershen08/vue-masonry/blob/master/src/masonry.plugin.js
import type { VoidCtx } from 'evt'
import type { ObjectDirective } from 'vue'
import { Evt, to } from 'evt'
import Masonry from 'masonry-layout'
import Vue from 'vue'

enum MasonryEvent {
  Add = 'vuemasonary.itemAdded',
  Remove = 'vuemasonary.itemRemoved',
  ImageLoaded = 'vuemasonary.imageLoaded',
  Destroy = 'vuemasonary.destroy',
}

const defaultId = 'VueMasonry'

type MasonryEvents = [MasonryEvent, void]

interface CleanUpData {
  id: string
  masonry: Masonry
  ctx: VoidCtx
  delay: number
}

const eventBusMap = new Map<string, Evt<MasonryEvents>>()
const cleanUpMap = new WeakMap<HTMLElement, CleanUpData>()

export const masonry: ObjectDirective = {
  bind(_el, binding) {
    const { id: masonryId = defaultId } = binding.value ?? {}
    const evt = Evt.create<MasonryEvents>()

    eventBusMap.set(masonryId, evt)
  },
  inserted(el, binding) {
    const { id: masonryId = defaultId, ...options } = binding.value ?? {}
    const evt = eventBusMap.get(masonryId)
    if (!Masonry || !evt) {
      throw new Error("Masonry plugin is not defined. Please check it's connected and parsed correctly.")
    }

    const ctx = Evt.newCtx()
    const masonry = new Masonry(el, options)
    const destroyDelay = options.destroyDelay ? Number.parseInt(options.destroyDelay, 10) : undefined

    cleanUpMap.set(el, {
      id: masonryId,
      masonry,
      ctx,
      delay: destroyDelay && !Number.isNaN(destroyDelay) ? destroyDelay : 0,
    })

    const masonryDraw = function () {
      masonry.reloadItems?.()
      masonry.layout?.()
    }

    Vue.nextTick(() => {
      masonryDraw()
    })

    evt.$attach(to(MasonryEvent.Add), ctx, masonryDraw)
    evt.$attach(to(MasonryEvent.Remove), ctx, masonryDraw)
    evt.$attach(to(MasonryEvent.ImageLoaded), ctx, masonryDraw)
  },

  unbind(el) {
    const cleanupData = cleanUpMap.get(el)
    if (!cleanupData) {
      return
    }

    const { id, masonry, ctx, delay } = cleanupData
    ctx.done()
    eventBusMap.delete(id)
    setTimeout(() => masonry.destroy?.(), delay)
  },
}

export const masonryItem: ObjectDirective = {
  inserted(el, binding) {
    const masonryId = binding.value || defaultId
    const evt = eventBusMap.get(masonryId)
    if (!evt || !(el instanceof HTMLImageElement)) {
      return
    }

    evt.post([MasonryEvent.Add, undefined])

    if (el.complete) {
      evt.post([MasonryEvent.ImageLoaded, undefined])
      return
    }

    el.addEventListener('load', () => evt.post([MasonryEvent.ImageLoaded, undefined]), { once: true })
  },

  unbind(el, binding) {
    const masonryId = binding.value || defaultId
    const evt = eventBusMap.get(masonryId)
    if (!evt) {
      return
    }
    evt.post([MasonryEvent.Remove, undefined])
  },
}

export function redrawVueMasonry(id: string = defaultId) {
  const evt = eventBusMap.get(id)
  if (!evt) {
    return
  }
  evt.post([MasonryEvent.Add, undefined])
}
