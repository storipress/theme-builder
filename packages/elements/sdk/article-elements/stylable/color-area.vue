<script lang="ts">
import { isNil, omitBy } from 'lodash'

import { addColor } from '../../store'
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
      const { kind, backgroundColor } = this
      addColor({
        path: kind ? ['article', kind] : ['article'],
        data: omitBy(
          {
            backgroundColor,
          },
          isNil
        ),
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
