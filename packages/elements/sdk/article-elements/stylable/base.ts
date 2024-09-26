import { isUndefined, omitBy } from 'lodash'

import { styleProps } from '../../../utils/style-props'
import { BaseElement } from '../inject'
import ArticleElement from './article-element.vue'
import { createProvider } from './provider'

export { BaseElement }

export const Element = BaseElement.extend({
  components: { ArticleElement },

  props: styleProps,

  computed: {
    element() {
      return createProvider()
    },

    styles(): Record<string, unknown> {
      return omitBy(this.$props, isUndefined)
    },
  },
})
