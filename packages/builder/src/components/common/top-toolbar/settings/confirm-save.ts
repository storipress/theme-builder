import { useRootActions, useRootState } from 'vuex-hooks'

import { UnsavedResponse, useUnsavedStore } from './unsaved-change/composables'

export function useConfirmSave() {
  const { savingStatus } = useRootState(['savingStatus'])
  const { updateCurrentPage } = useRootActions(['updateCurrentPage'])

  const unsavedStore = useUnsavedStore()

  return async () => {
    if (savingStatus.value !== 'edited') {
      return
    }
    const res = await unsavedStore.showDialog()
    if (res === UnsavedResponse.Discard) {
      unsavedStore.skipSaveCheck = true
      return
    }
    return updateCurrentPage()
  }
}
