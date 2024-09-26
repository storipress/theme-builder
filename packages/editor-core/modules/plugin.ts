import type { Plugin } from 'vuex'

import type { Client, WordStatistics } from '../core/types'
import type { State as EditorState } from './editor-state'
import type { State as WordCountState } from './word-count'
import { clients, historyState, plaintext, saved, wordCount } from '../core/global-bus'

interface EditorStore {
  editorState: EditorState
  wordCount: WordCountState
  [key: string]: any
}

export const connectEditorState: Plugin<EditorStore> = (store) => {
  function handleHistory(history: { undo: boolean; redo: boolean }) {
    store.commit('editorState/SET_HISTORY', history)
  }

  function handleSaved(saved: boolean) {
    store.commit('editorState/SET_SAVED', saved)
  }

  function handleWordCount(statistics: WordStatistics) {
    store.commit('wordCount/SET_STATISTICS', statistics)
  }

  function handlePlainText(plaintext: string) {
    store.commit('editorState/SET_PLAINTEXT', plaintext)
  }

  function handleClients(clients: Client[]) {
    store.commit('editorState/SET_CLIENTS', clients)
  }

  handleHistory(historyState.state)
  handleSaved(saved.state)
  handleWordCount(wordCount.state)
  handlePlainText(plaintext.state)
  handleClients(clients.state)

  historyState.attach(handleHistory)
  saved.attach(handleSaved)
  wordCount.attach(handleWordCount)
  plaintext.attach(handlePlainText)
  clients.attach(handleClients)
}
