import type { Module } from 'vuex'
import { createNamespacedHelpers } from 'vuex'

export interface DialogInfo<Type extends string = string, Param = unknown, ReturnValue = unknown> {
  type: Type
  param: Param
  returnValue: ReturnValue | null
}

const initialState = {
  info: null as DialogInfo<string> | null,
}

export const remoteDialogHelper = createNamespacedHelpers('remoteDialog')

export type State = typeof initialState

export const remoteDialog: Module<State, unknown> = {
  namespaced: true,

  state: initialState,

  mutations: {
    SET_DIALOG(state, info: DialogInfo | null) {
      state.info = info
    },

    SET_RETURN(state, returnValue: unknown) {
      if (!state.info) {
        return
      }
      state.info.returnValue = returnValue
    },
  },
}
