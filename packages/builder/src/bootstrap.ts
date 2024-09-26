import { enablePatches } from 'immer'
import Vue from 'vue'
import { VueMasonryPlugin } from 'vue-masonry'
import VuexHooks from 'vuex-hooks'

// ask immer to record steps
enablePatches()

Vue.use(VuexHooks)
Vue.use(VueMasonryPlugin)
