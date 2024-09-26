import { until } from '@vueuse/core'
import { defineStore } from 'pinia'

export enum UnsavedResponse {
  Save = 'save',
  Discard = 'discard',
}

export const useUnsavedStore = defineStore({
  id: 'unsaved',
  state: () => ({
    isUnsaved: false,
    show: false,
    response: null as UnsavedResponse | null,
    skipSaveCheck: false,
  }),
  actions: {
    async showDialog(): Promise<UnsavedResponse> {
      this.show = true
      await until(() => this.show === false).toBe(true)
      const response = this.response ?? UnsavedResponse.Discard
      this.response = null
      return response
    },
    responseDialog(response: UnsavedResponse) {
      this.response = response
      this.show = false
    },
  },
})
