import type { PropType } from 'vue-demi'
import type { Viewport } from '../modules/virtual-viewport'
import { noop } from 'lodash'
import { defineComponent, h, onBeforeUnmount, onMounted } from 'vue-demi'

import { useMutations } from 'vuex-hooks'

type Mapper = (viewport: Viewport) => Viewport | void

export function captureViewport(): Viewport {
  return {
    top: `${window.scrollY}px`,
    height: `${document.documentElement.clientHeight}px`,
  }
}

export function useCaptureViewport(mapper: Mapper = noop) {
  const mutations = useMutations('virtualViewport')

  function listener() {
    const viewport = captureViewport()
    mutations.SET_VIEWPORT(mapper(viewport) ?? viewport)
  }
  onMounted(() => {
    listener()
    window.addEventListener('resize', listener, { passive: true })
    window.addEventListener('scroll', listener, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', listener)
    window.removeEventListener('scroll', listener)
  })
}

export const ViewportCapturer = defineComponent({
  props: {
    mapper: {
      type: Function as PropType<Mapper>,
    },
  },

  setup(props) {
    useCaptureViewport(props.mapper)

    return () => h()
  },
})
