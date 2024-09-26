import type { Store } from 'vuex'

const TOKEN_KEY = 'storipress-token'

export function persisted(store: Store<any>) {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      store.commit('auth/SET_TOKEN', token)
    }
    // swallow error if in incognito mode
  } catch {}
}
