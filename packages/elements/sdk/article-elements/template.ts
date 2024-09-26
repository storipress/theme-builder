import Vue from 'vue'

import * as components from './elements'

export const Template = Vue.extend({
  components: { ...components },
  props: {
    article: {
      type: Object,
    },
  },
})
