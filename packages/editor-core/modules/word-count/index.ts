import type { WordStatistics } from '@storipress/editor-core'
import type { Module } from 'vuex'

export interface State {
  statistics: WordStatistics
}

const initialState: State = {
  statistics: {
    characters: 0,
    images: 0,
    paragraphs: 0,
    spaces: 0,
    words: 0,
  },
}

const FIRST_IMAGE_READ = 12
const IMAGE_THRESHOLD = 10
const TEN_IMAGE_READ_TIME = 75

export const wordCount: Module<State, any> = {
  namespaced: true,

  state: initialState,

  getters: {
    readTime({ statistics: { words } }, { imageReadTime }): number {
      return Math.max(Math.round(((words / 275) * 60 + imageReadTime) / 60), 1)
    },

    imageReadTime({ statistics: { images } }): number {
      if (images < IMAGE_THRESHOLD) {
        // 1st take 12s, 2nd 11s, ... after 10th take 3s
        return ((FIRST_IMAGE_READ + (FIRST_IMAGE_READ - images + 1)) * images) / 2
      }
      return TEN_IMAGE_READ_TIME + (images - IMAGE_THRESHOLD) * 3
    },
  },

  mutations: {
    SET_STATISTICS(state, statistics: WordStatistics) {
      state.statistics = statistics
    },
  },
}
