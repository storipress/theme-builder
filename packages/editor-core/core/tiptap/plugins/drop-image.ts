import type { EditorView } from 'prosemirror-view'
import { Extension } from '@tiptap/core'
import { nanoid } from 'nanoid'
import { Plugin, PluginKey } from 'prosemirror-state'
import invariant from 'tiny-invariant'
import { isWebUri } from 'valid-url'

import { droppedItems } from '../../../schema/image'
import { getAPI } from '../../api'

export const dropImage = Extension.create({
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('dropImage'),
        props: {
          handlePaste(view, event, slice) {
            const items = [...(event.clipboardData?.items || [])]
            if (slice.size === 0 && items.some((item) => item.type.startsWith('image'))) {
              const images = items.filter((item) => /image/i.test(item.type)).map((item) => item.getAsFile() as File)

              if (images.length === 0) {
                return false
              }

              event.preventDefault()

              insertAllImages(view, images, view.state.selection.from)
              return true
            }
            return false
          },
          handleDOMEvents: {
            drop(view, e) {
              // we are dragging inside the editor so we don't want to handle this
              if (view.dragging) {
                return false
              }

              const event = e as DragEvent
              if (!event.dataTransfer) {
                return true
              }

              const hasFiles = event.dataTransfer.files && event.dataTransfer.files.length > 0
              const url =
                event.dataTransfer.getData('url') ??
                event.dataTransfer.getData('text/plain') ??
                event.dataTransfer.getData('text/uri-list')

              if (!hasFiles && !url) {
                return true
              }

              if (url) {
                event.preventDefault()
                if (!isWebUri(url)) {
                  return false
                }

                const { schema, tr } = view.state
                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
                invariant(coordinates, 'cannot find drop coordinate')

                const id = nanoid()
                const api = getAPI()
                droppedItems.set(id, { kind: 'url', promise: api.uploadImageFromURL(url) })
                const node = schema.nodes.image.create({
                  file: id,
                })
                const transaction = tr.insert(coordinates.pos, node)
                view.dispatch(transaction)

                return false
              }

              const images = [...(event.dataTransfer?.files ?? [])].filter((file) => /image/i.test(file.type))

              if (images.length > 0) {
                event.preventDefault()

                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
                invariant(coordinates, 'cannot find drop coordinate')
                insertAllImages(view, images, coordinates.pos)
                return false
              }

              return true
            },
          },
        },
      }),
    ]
  },
})

function insertAllImages(view: EditorView<any>, images: File[], pos: number) {
  const { schema, tr } = view.state
  images.forEach((img) => {
    const id = nanoid()
    droppedItems.set(id, { kind: 'file', file: img })
    const node = schema.nodes.image.create({
      file: id,
    })
    const transaction = tr.insert(pos, node)
    view.dispatch(transaction)
  })
}
