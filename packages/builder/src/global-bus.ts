import { Evt } from 'evt'
import Vue from 'vue'

export const bus = Vue.observable({
  editable: false,
})

export const bodyClick = Evt.from(document.body, 'click', { passive: true })
export const windowBlur = Evt.from(window, 'blur', { passive: true })

export const authFail = Evt.create()

export const clientID = Evt.create<string | null>(null)
export const token = Evt.create<string | null>(null)
