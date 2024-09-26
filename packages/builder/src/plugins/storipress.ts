import type _Vue from 'vue'
import type { store as Store } from '../store'

import { computed, reactive } from 'vue'

interface Storipress {
  clientID: string
}

declare module 'vue/types/vue' {
  interface Vue {
    $storipress: Storipress
  }
}

export function storipress(Vue: typeof _Vue, { store }: { store: typeof Store }) {
  Vue.prototype.$storipress = reactive({
    clientID: computed(() => store.state.clientID),
  })
}
