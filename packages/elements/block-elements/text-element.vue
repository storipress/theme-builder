<script lang="ts">
import { omit } from 'lodash'
import Vue from 'vue'

import { styleProps } from '../utils/style-props'
import { BlockChild } from './base-element'
import GenericElement from './generic-element.vue'

export default BlockChild.extend({
  components: { GenericElement },

  props: {
    component: String,
    kind: String,
    blockType: String,
    ...styleProps,
  },

  inject: ['blockId'],

  computed: {
    genericElementProps() {
      return {
        ...omit(this.$props, ['kind', 'blockType']),
        display: 'Display Text',
        path: [`b-${this.blockId}`, this.kind],
      }
    },
  },

  created() {
    if ((this as any).blockType) {
      Vue.util.warn('blockType is depercated', this as any)
    }
  },
})
</script>

<template>
  <GenericElement v-bind="genericElementProps">
    <slot />
  </GenericElement>
</template>
