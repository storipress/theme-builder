import type { Module } from 'vuex'

import type { Client } from '../../core/types'

interface HistoryState {
  undo: boolean
  redo: boolean
}

const initialState = {
  history: {
    undo: false,
    redo: false,
  },
  saved: true,
  plaintext: '',
  scrollTop: 0,
  editorTop: 0,
  clients: [] as Client[],
}

export type State = typeof initialState

export const editorState: Module<State, any> = {
  namespaced: true,

  state: initialState,

  mutations: {
    SET_HISTORY(state, history: HistoryState) {
      state.history = history
    },

    SET_SAVED(state, saved: boolean) {
      state.saved = saved
    },

    SET_PLAINTEXT(state, plaintext: string) {
      state.plaintext = plaintext
    },

    SET_CLIENTS(state, clients: Client[]) {
      state.clients = clients
    },

    SET_SCROLL_TOP(state, scrollTop: number) {
      state.scrollTop = scrollTop
    },

    SET_EDITOR_TOP(state, editorTop: number) {
      state.editorTop = editorTop
    },
  },
}
