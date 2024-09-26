import type { AnyExtension } from '@tiptap/core'
import { Extension } from '@tiptap/core'
import { Dropcursor } from '@tiptap/extension-dropcursor'
import { Gapcursor } from '@tiptap/extension-gapcursor'
import { Placeholder } from '@tiptap/extension-placeholder'

import { schemaExtensions } from '../../schema'
import { dropImage, FocusClasses, WordCount } from './plugins'

export const setAttributes = Extension.create({
  name: 'setAttributes',
  onCreate() {
    const { view } = this.editor
    view.dom.classList.add('article-content', 'main-content')
    view.dom.setAttribute('spellcheck', 'true')
    return {}
  },
})

export const extensions: AnyExtension[] = [
  ...schemaExtensions,
  Dropcursor,
  Gapcursor,
  FocusClasses,
  Placeholder.configure({
    emptyNodeClass: 'empty-node',
    placeholder: 'Start writing your article ...',
  }),
  setAttributes,
  dropImage,
  WordCount,
]
