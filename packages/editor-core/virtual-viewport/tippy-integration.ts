import type { Instance } from 'tippy.js'
import type { State } from '../modules/virtual-viewport'
import { watch } from 'vue-demi'

import { useState } from 'vuex-hooks'

export type Boundary = 'clippingParents' | HTMLElement | HTMLElement[]

let globalBoundary: Boundary = 'clippingParents'

export function getBoundary() {
  return globalBoundary
}

export function setBoundary(boundary: Boundary) {
  globalBoundary = boundary
}

export function listenToViewport(instance: Instance) {
  const { viewport } = useState<State>('virtualViewport')

  watch(viewport, () => {
    instance.popperInstance?.update()
  })
}
