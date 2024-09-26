import type { Module } from 'vuex'

import type { RootState } from '../types'

const initialState = {
  version: 0,
}

export type State = typeof initialState

export const dataSource: Module<State, RootState> = {
  namespaced: true,

  state: initialState,

  mutations: {
    INCREASE_VERSION(state) {
      state.version += 1
    },
  },
}
