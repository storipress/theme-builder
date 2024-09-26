import type { AnyExtension } from '@tiptap/core'
import type { FullPresetInput } from './presets'

import { Editor } from '@tiptap/core'
import { base, createFull } from './presets'

export function configureEditor(extensions: AnyExtension[]) {
  return new Editor({
    extensions,
  })
}

export function configureBasicEditor() {
  return configureEditor(base)
}

export function configureFullEditor(input: FullPresetInput) {
  const { connect, extensions } = createFull(input)
  return { connect, editor: configureEditor(extensions) }
}
