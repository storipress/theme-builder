import type { EditorUser } from './types'
import { Collaboration } from '@tiptap/extension-collaboration'
import { CollaborationCursor } from '@tiptap/extension-collaboration-cursor'
import { History } from '@tiptap/extension-history'
import { after } from 'lodash'
import invariant from 'tiny-invariant'
import { WebsocketProvider } from 'y-websocket'

import * as Y from 'yjs'
import { clients, saved } from './global-bus'
import { Comment, CommentStub } from './tiptap/comment'
import { extensions } from './tiptap/extensions'
import { CollaborationAnnotation, ReadUser } from './tiptap/plugins'
import { renderCursor } from './tiptap/render-cursor'

export const base = [...extensions, History, CommentStub]

/**
 * options to create full preset
 */
export interface FullPresetInput {
  /// host to connect
  url: string
  /// auth token
  token: string
  /// format `<client id>.<article id>`, you can delay the connect by pass in `undefined`
  room?: string
}

const inspected = Symbol('@@inspected')

export function createFull({ url, token, room }: FullPresetInput) {
  let initialized = '0'
  // A new Y document
  const ydoc = new Y.Doc()
  // Registered with a WebSocket provider
  const provider = new WebsocketProvider(url, room || '', ydoc, {
    connect: !!room,
    params: { uid: token, initialized },
  })

  ydoc.on(
    'update',
    // the first message is for initialized article
    after(2, () => {
      saved.post(false)
    })
  )

  if (provider.ws) {
    inspectWebsocket(provider)
  }

  ydoc.once('update', () => {
    initialized = '1'
    updateUrl(room as string)
  })

  return {
    /**
     * deferred connect to server, calling this function will be no-op if it's already connected
     * @param innerRoom room name, format: `<client id>.<article id>`
     * @returns
     */
    connect: (innerRoom: string) => {
      if (room) {
        return
      }

      room = innerRoom

      updateUrl(room)
      provider.connect()
      inspectWebsocket(provider)
    },

    extensions: [
      ...extensions,
      // new Comment(),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider,
        render: renderCursor,
      }),
      CollaborationAnnotation.configure({
        document: ydoc,
        HTMLAttributes: {
          class: 'comment',
        },
      }),
      Comment,
      ReadUser.configure({
        onUpdate(users) {
          clients.post(
            users.map(({ clientId, ...user }) => ({
              clientID: `${clientId}`,
              user: user as EditorUser,
            }))
          )
          return null
        },
      }),
    ],
  }

  function updateUrl(room: string) {
    provider.bcChannel = `${url}/${room}`
    provider.roomname = room
    provider.url = `${url}/${room}?${new URLSearchParams({ uid: token, initialized })}`
  }
}

// here we intercept the websocket message and inspect the sync message
function inspectWebsocket(provider: WebsocketProvider) {
  invariant(provider.ws, 'websocket not found')

  if (Reflect.get(provider, inspected)) {
    return
  }

  Reflect.set(provider, inspected, true)

  const onmessage = provider.ws.onmessage

  provider.ws.onmessage = function (event) {
    const body = new Uint8Array(event.data)
    // the header of sync message
    if (body[0] === 0x00 && body[1] === 0x02) {
      saved.post(true)
    }
    onmessage?.call(this, event)
  }

  // just make sure the state is saved
  saved.post(true)
}
