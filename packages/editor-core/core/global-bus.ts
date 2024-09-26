import type { Editor } from '@tiptap/core'
import type { Transaction } from 'prosemirror-state'
import type { Client, WordStatistics } from './types'
import { Evt } from 'evt'

import { fromHTML } from 'shared/to-description'

export { warnExceedSizeLimit } from '../schema'

interface TransactionInfo {
  editor: Editor
  tr: Transaction | null
}

export const transaction = Evt.create<TransactionInfo>()

export const wordCount = Evt.create<WordStatistics>({
  characters: 0,
  images: 0,
  paragraphs: 0,
  spaces: 0,
  words: 0,
})

export const clients = Evt.create<Client[]>([])

export const saved = Evt.create<boolean>(true)

export const historyState = transaction
  .pipe(({ editor }) => [{ undo: editor.can().undo(), redo: editor.can().redo() }])
  .toStateful({ undo: false, redo: false })

export const documentModify = transaction.pipe(({ tr }) => {
  return tr?.docChanged || false
})

export const plaintext = transaction
  .pipe(({ editor }) => {
    const res = fromHTML(editor.getHTML())
    return [res]
  })
  .toStateful('')

export const undo = Evt.create()
export const redo = Evt.create()
export const focus = Evt.create()
