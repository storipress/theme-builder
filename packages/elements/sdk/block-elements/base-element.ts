import type { VueConstructor } from 'vue'
import Vue from 'vue'

export const BaseElement = Vue.extend({})

type withElementAndID = VueConstructor<Vue & { blockId: string }>

export const BlockChild = (BaseElement as withElementAndID).extend({
  inject: ['blockId'],
})
