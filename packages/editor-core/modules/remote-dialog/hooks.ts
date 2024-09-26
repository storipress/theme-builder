import type { DialogInfo, State } from './module'
import pDefer from 'p-defer'
import { computed, watch } from 'vue-demi'

import { useMutations, useState } from 'vuex-hooks'

export function useRemoteDialog<T extends DialogInfo>(type: T['type']) {
  const state = useState<State>('remoteDialog')
  const mutations = useMutations('remoteDialog')

  return {
    open(param: T['param']): Promise<T['returnValue']> {
      const deferred = pDefer<NonNullable<T['returnValue']>>()
      mutations.SET_DIALOG({ type, param, returnValue: null })
      const stopListen = watch(
        () => state.info.value?.returnValue as T['returnValue'] | null | undefined,
        (returnValue: T['returnValue'] | null | undefined) => {
          if (returnValue) {
            stopListen()
            deferred.resolve(returnValue as any)
            mutations.SET_DIALOG(null)
          } else if (!state.info.value) {
            stopListen()
            deferred.resolve()
          }
        }
      )
      return deferred.promise
    },
  }
}

export function useRemoteDialogProvider<T extends DialogInfo>(type: T['type']) {
  const state = useState<State>('remoteDialog')
  const mutations = useMutations('remoteDialog')

  return {
    param: computed((): T['param'] | null => {
      if (state.info.value?.type === type) {
        return state.info.value.param
      }
      return null
    }),
    reply(returnValue: T['returnValue']) {
      mutations.SET_RETURN(returnValue)
    },
    close() {
      mutations.SET_DIALOG(null)
    },
  }
}
