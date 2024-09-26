<script lang="ts">
import type { VueConstructor } from 'vue'
import { omit } from 'lodash'
import Vue from 'vue'

import GenericElement from './generic-element.vue'
import { styleProps } from './style-props'

type withBlockId = VueConstructor<Vue & { blockId: string }>

export default (Vue as withBlockId).extend({
  components: { GenericElement },

  inject: ['blockId'],

  props: {
    component: { type: String, required: true },
    kind: { type: String, required: true },
    blockType: { type: String },

    ...styleProps,
  },

  computed: {
    genericElementProps() {
      const blockClass = `b-${this.blockId}`
      return {
        ...omit(this.$props, ['kind', 'blockType']),
        display: 'Display Text',
        path: [blockClass, this.kind],
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
