<script lang="ts">
import { isNil, omitBy } from 'lodash'

import { BaseElement } from '../inject'

export default BaseElement.extend({
  props: {
    kind: {
      type: String,
    },
    component: {
      type: String,
      default: 'div',
    },
    disabled: {
      type: Boolean,
    },
    backgroundColor: {
      type: [String, Object],
    },
  },

  mounted() {
    if (!this.disabled) {
      const { kind, backgroundColor, $element } = this
      $element.setElementStyle({
        path: kind ? ['article', kind] : ['article'],
        data: omitBy(
          {
            backgroundColor,
          },
          isNil
        ),
        skipHistory: true,
      })
    }
  },
})
</script>

<template>
  <component :is="component" :class="kind" v-on="$listeners">
    <slot />
  </component>
</template>
