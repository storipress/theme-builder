import type { Module, Plugin, Store } from 'vuex'
import type { Remote } from '../channel'
import { noop } from 'lodash'

import invariant from 'tiny-invariant'
import { channelId, connectToChannel, isHost } from '../channel'
import { deserialize, serialize } from '../utils/serde'

export interface SyncAPI {
  commit: (kind: string, payload: unknown) => void
  childConnect: (client: string) => void
  initStore: (state: { client: string; state: unknown }) => void
}

let vuexStore: Store<unknown>

const api = {
  childConnect(client: string) {
    vuexStore.dispatch('sync-plugin/childConnect', client)
  },

  initStore({ client, state }: { client: string; state: string }) {
    if (client === channelId) {
      vuexStore.commit('sync-plugin/INIT_STORE', deserialize(state))
    }
  },

  commit(kind: string, payload: unknown) {
    vuexStore.dispatch('sync-plugin/receiveRemote', { type: kind, payload })
  },
}

export const sync: Plugin<any> = async (store: Store<any>) => {
  vuexStore = store
  const isClient = !isHost()
  const remote = await connectToChannel<SyncAPI>(api)
  if (!remote) {
    invariant(isClient, 'fail to create channel at host')
    return
  }
  registerModule(store, remote, !isClient)

  if (isClient) {
    remote.childConnect(channelId)
  }
}

function registerModule(store: Store<any>, remote: Remote<SyncAPI>, isHost: boolean) {
  let bypass = false
  const syncModule: Module<{ initialized: boolean }, any> = {
    namespaced: true,

    state: {
      initialized: isHost,
    },

    mutations: {
      INIT_STORE: noop,
    },

    actions: {
      receiveRemote({ commit }, { type, payload }) {
        bypass = true
        commit(type, payload, { root: true })
        bypass = false
      },

      childConnect(_, client: string) {
        remote.initStore({ client, state: serialize(store.state) })
      },
    },
  }

  store.registerModule('sync-plugin', syncModule)

  store.subscribe(({ type, payload }) => {
    if (bypass) {
      return
    }

    if (type === 'sync-plugin/INIT_STORE') {
      store.replaceState({
        ...payload,
        'sync-plugin': { initialized: true },
      })
      return
    }

    remote.commit(type, payload)
  })
}
