import { isUndefined, omitBy } from 'lodash'

import { styleProps } from '../../utils/style-props'
import { BaseElement } from '../inject'
import ArticleElement from './article-element.vue'

export { BaseElement }

export const Element = BaseElement.extend({
  components: { ArticleElement },

  props: {
    ...styleProps,
  },

  computed: {
    styles(): Record<string, unknown> {
      return omitBy(this.$props, isUndefined)
    },
  },
})
