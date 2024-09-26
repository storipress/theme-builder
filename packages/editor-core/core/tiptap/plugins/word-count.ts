import type { Node } from 'prosemirror-model'
import type { WordStatistics } from '../../types'
import wordCount from '@iarna/word-count'

import { Extension } from '@tiptap/core'
import { wordCount as wordCountBus } from '../../global-bus'

export const WordCount = Extension.create({
  name: 'wordCount',
  onUpdate() {
    const { editor } = this
    const statistics = count(editor.state.doc)
    wordCountBus.post(statistics)
  },
})

function count(doc: Node) {
  const statistics: WordStatistics = {
    words: 0,
    paragraphs: 0,
    characters: 0,
    spaces: 0,
    images: 0,
  }
  doc.forEach((node) => {
    switch (node.type.name) {
      case 'paragraph':
        countParagraph(node, statistics)
        break

      case 'image':
        statistics.images += node.attrs.src ? 1 : 0
        break

      case 'gallery':
        statistics.images += node.attrs.images.length
        break
    }
  })
  return statistics
}

function countParagraph(node: Node<any>, statistics: WordStatistics) {
  const s = node.textContent
  statistics.characters += [...s].length
  statistics.spaces += s.match(/(\s+)/g)?.length ?? 0
  statistics.paragraphs += s.length > 0 ? 1 : 0
  statistics.words += wordCount(s)
}
