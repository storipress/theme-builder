import type { Profile } from '../api'
import type { Integration, Release } from '../generated/graphql'
import type { Preview, SavingStatus } from './types'
import { connectEditorState, editorModules } from '@storipress/editor-core'

import { sync } from 'shared/vuex'
import Vue from 'vue'
import Vuex from 'vuex'
import { getIntegrations, getProfile, getReleases, triggerSiteBuild } from '../api'
import { authFail } from '../global-bus'
import { PREVIEW_TO_BREAKPOINT } from '../utils/style'
import { article } from './modules/article'
import { auth } from './modules/auth'
import { common } from './modules/common'
import { front } from './modules/front'
import { other } from './modules/other'

export const SET_PREVIEW = 'SET_PREVIEW'
export const SET_SAVING_STATUS = 'SET_SAVING_STATUS'
export const SET_CLIENT_ID = 'SET_CLIENT_ID'
export const SET_ROUTE = 'SET_ROUTE'
export const SET_RELEASE = 'SET_RELEASE'
export const SET_PROFILE = 'SET_PROFILE'
export const SET_NEWEST_RELEASE = 'SET_NEWEST_RELEASE'
export const SET_IS_DEPLOYING = 'SET_IS_DEPLOYING'
export const SET_LAST_RELEASE_HISTORY_STEP = 'SET_LAST_RELEASE_HISTORY_STEP'
export const SET_INTEGRATIONS = 'SET_INTEGRATIONS'

Vue.use(Vuex)

const initialState = {
  preview: 'desktop' as Preview,
  savingStatus: 'done' as SavingStatus,
  clientID: '',
  releases: [] as Array<Release>,
  lastReleaseHistoryStep: 0,
  newestReleaseId: '',
  isDeploying: false,
  integrations: [] as Array<Integration>,
  profile: null as null | Profile,
  route: {
    name: '',
    path: '',
    fullPath: '',
    hash: '',
    params: {},
    query: {},
    meta: {},
  },
}

export type State = typeof initialState

const vuexPlugins = [sync, connectEditorState as any]

export const store = new Vuex.Store({
  plugins: vuexPlugins,
  modules: { article, common, front, other, auth, ...editorModules },

  state: initialState,

  getters: {
    isPreviewMode({ preview }): boolean {
      return preview === 'expanded'
    },
    breakpoint({ preview }): 'xs' | 'md' | 'lg' {
      return PREVIEW_TO_BREAKPOINT[preview]
    },
    lastSuccessRelease({ releases }) {
      if (!releases || releases.length === 0) return {}
      return releases.find((r) => r.state === 'done')
    },
    currentStoreModule(state): string {
      const routeName = state.route.name

      switch (routeName) {
        case 'article':
          return 'article'

        case 'other':
          return 'other'

        case 'front-page':
        default:
          return 'front'
      }
    },
    currentStep(state, getters, rootState: any): number {
      const history = rootState[getters.currentStoreModule].history
      return history.undo.length
    },
    isUndoable(state, getters, rootState: any, rootGetters): boolean {
      return rootGetters[`${getters.currentStoreModule}/isUndoable`]
    },
    isRedoable(state, getters, rootState: any, rootGetters): boolean {
      return rootGetters[`${getters.currentStoreModule}/isRedoable`]
    },
    isCurrentVersion(state, getters): boolean {
      return state.lastReleaseHistoryStep === getters.currentStep
    },
  },

  mutations: {
    [SET_PREVIEW](store, val: Preview) {
      store.preview = val
    },
    [SET_SAVING_STATUS](store, payload: SavingStatus) {
      store.savingStatus = payload
    },
    [SET_CLIENT_ID](store, clientID: string) {
      store.clientID = clientID
    },
    [SET_ROUTE](state, payload) {
      state.route = payload
    },
    [SET_RELEASE](state, payload) {
      state.releases = payload
    },
    [SET_PROFILE](state, payload) {
      state.profile = payload
    },
    [SET_NEWEST_RELEASE](state, payload: string) {
      state.newestReleaseId = payload
    },
    [SET_IS_DEPLOYING](state, payload: boolean) {
      state.isDeploying = payload
    },
    [SET_LAST_RELEASE_HISTORY_STEP](state, payload: number) {
      state.lastReleaseHistoryStep = payload
    },
    [SET_INTEGRATIONS](state, payload: Array<Integration>) {
      state.integrations = payload
    },
  },

  actions: {
    resetPageState({ commit }) {
      commit(SET_PREVIEW, 'desktop')
      commit(SET_SAVING_STATUS, 'done')
      commit(SET_LAST_RELEASE_HISTORY_STEP, 0)
    },
    async fetchReleases({ commit }) {
      const data = await getReleases()
      commit(SET_RELEASE, data)
      if (data?.[0].state !== 'done') commit(SET_IS_DEPLOYING, true)
    },
    async fetchIntegrations({ commit }) {
      const data = await getIntegrations()
      commit(SET_INTEGRATIONS, data)
    },
    async fetchProfile({ commit }) {
      const profile = await getProfile()
      commit(SET_PROFILE, profile)
    },
    async updateCurrentPage({ getters, dispatch, commit }) {
      commit(SET_SAVING_STATUS, 'loading')
      try {
        await dispatch(`${getters.currentStoreModule}/updateCurrentPage`)
        commit(SET_SAVING_STATUS, 'done')
      } catch {
        commit(SET_SAVING_STATUS, 'edited')
      }
    },
    async publish({ getters, dispatch, commit }) {
      commit(SET_IS_DEPLOYING, true)
      const currentStep = getters.currentStep
      commit(SET_SAVING_STATUS, 'loading')
      try {
        await dispatch(`${getters.currentStoreModule}/publish`)
        await dispatch('siteBuild')
        commit(SET_LAST_RELEASE_HISTORY_STEP, currentStep)
        commit(SET_SAVING_STATUS, 'done')
      } catch {
        commit(SET_SAVING_STATUS, 'edited')
      }
    },
    async siteBuild({ commit }) {
      commit(SET_IS_DEPLOYING, true)

      const releaseId = await triggerSiteBuild()
      commit(SET_NEWEST_RELEASE, releaseId)
    },
    undo({ getters, dispatch }) {
      dispatch(`${getters.currentStoreModule}/undo`)
    },
    redo({ getters, dispatch }) {
      dispatch(`${getters.currentStoreModule}/redo`)
    },
  },
})

authFail.attach(() => {
  store.commit('auth/SET_TOKEN', null)
})
