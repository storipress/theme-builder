import { computed, watch } from 'vue-demi'
import { useActions, useStore } from 'vuex-hooks'

import { useLoadingStore } from './loading'

export function useOtherPage(props: { id: string }) {
  const { loadPage } = useActions('other')
  const store = useStore()
  const isPreviewMode = computed(() => {
    return store.state.preview === 'expanded'
  })
  const loadingStore = useLoadingStore()

  watch(
    () => props.id,
    (id) => {
      loadingStore.waitPromise(loadPage(id), 'Fail to load page. Please check your network connection and try again.')
    },
    { immediate: true },
  )

  return {
    isPreviewMode,
    loadPage,
  }
}
