<script lang="ts">
import type { VueConstructor } from 'vue'
import type Vue from 'vue'
import { isNil, omitBy } from 'lodash'

import { addColor } from '../store'
import { BaseElement } from './base-element'

type withBlockId = VueConstructor<Vue & { blockId: string }>

export default (BaseElement as withBlockId).extend({
  props: {
    kind: {
      type: String,
    },
    component: {
      type: String,
      default: 'div',
    },
    backgroundColor: {
      type: [String, Object],
    },
  },

  inject: ['blockId'],

  mounted() {
    const { kind, blockId, backgroundColor } = this
    const blockClass = `b-${blockId}`
    addColor({
      path: kind ? [blockClass, kind] : [blockClass],
      data: omitBy(
        {
          backgroundColor,
        },
        isNil
      ),
    })
  },
})
</script>

<template>
  <component :is="component" :class="kind" v-on="$listeners">
    <slot />
  </component>
</template>
