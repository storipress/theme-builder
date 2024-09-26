import type { Module } from 'vuex'
import type { RootState } from '../types'

import { createNamespacedHelpers } from 'vuex'
import { token as tokenEvt } from '../../global-bus'

export const SET_TOKEN = 'SET_TOKEN'

export const authHelpers = createNamespacedHelpers('auth')

const initialState = {
  token: null as string | null,
}

export type State = typeof initialState

export const auth: Module<State, RootState> = {
  namespaced: true,

  state: initialState,

  mutations: {
    [SET_TOKEN](state, token) {
      state.token = token
      tokenEvt.post(token)
    },
  },
}
