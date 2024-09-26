import type { Module } from 'vuex'

export interface Viewport {
  top: '0' | `${number}px`
  height: `${number}px` | '100%'
}

export interface State {
  viewport: Viewport
}

const initialState: State = {
  viewport: {
    top: '0',
    height: '100%',
  },
}

export const virtualViewport: Module<State, any> = {
  namespaced: true,

  state: initialState,

  mutations: {
    SET_VIEWPORT(state, viewport: Viewport) {
      state.viewport = viewport
    },
  },
}
