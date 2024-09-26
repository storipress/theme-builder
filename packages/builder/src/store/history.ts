import type { BaseStep } from './step'

import invariant from 'tiny-invariant'
import { AggregateStep } from './step'

export const UNDO_HISTORY = 'UNDO_HISTORY'
export const REDO_HISTORY = 'REDO_HISTORY'
export const START_TX = 'START_TX'
export const COMMIT_TX = 'COMMIT_TX'
export const ROLLBACK_TX = 'ROLLBACK_TX'

export interface HistoryState {
  undo: BaseStep[]
  redo: BaseStep[]
  transactions?: null | BaseStep[]
}

export function createHistory(): HistoryState {
  return {
    undo: [],
    redo: [],
    transactions: null,
  }
}

export function pushHistory(store: HistoryState, step: BaseStep) {
  // ignore empty step
  if (step.isEmpty) {
    return
  }

  if (store.transactions) {
    store.transactions.push(step)
    return
  }

  store.undo.push(step)
  store.redo = []
}

export function startTransaction(store: HistoryState) {
  store.transactions = []
}

export function commitTransaction(store: HistoryState) {
  invariant(store.transactions, 'transaction not start')
  const tx = store.transactions
  store.transactions = null
  pushHistory(store, new AggregateStep(tx))
}

export function rollbackTransaction(store: Record<string, any>, history: HistoryState) {
  if (!history.transactions) {
    return
  }
  const tx = history.transactions.reverse()
  history.transactions = null
  for (const step of tx) {
    step.apply(store)
  }
}

export function moveStep(store: Record<string, any>, from: BaseStep[], to: BaseStep[]) {
  const step = from.pop()
  if (!step) {
    return
  }
  step.apply(store)
  to.push(step.inverse())
}
