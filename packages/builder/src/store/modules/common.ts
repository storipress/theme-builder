import type { Module } from 'vuex'
import type { Site } from '../../api'

import type { RootState } from '../types'
import { createNamespacedHelpers } from 'vuex'
import { getSite } from '../../api'

export const SET_SITE = 'SET_SITE'
export const SET_SCALE = 'SET_SCALE'

export const commonHelpers = createNamespacedHelpers('common')

const initialState = {
  site: {
    name: '',
    workspace: '',
    socials: undefined,
    customer_site_domain: '',
  } as Site,
  scale: 1,
}

export type State = typeof initialState

export const common: Module<State, RootState> = {
  namespaced: true,

  state: initialState,

  mutations: {
    [SET_SITE](state, site: Site) {
      state.site = {
        ...site,
        socials: {
          ...site.socials,
          ...Object.fromEntries(Object.entries(site.socials || {}).map(([key, value]) => [key.toLowerCase(), value])),
        },
      }
    },

    [SET_SCALE](state, scale: number) {
      state.scale = scale
    },
  },

  actions: {
    async fetchSite({ commit }) {
      commit(SET_SITE, await getSite())
    },
  },
}
