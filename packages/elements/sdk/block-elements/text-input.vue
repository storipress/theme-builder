<script lang="ts">
import type { VueConstructor } from 'vue'
import { omit } from 'lodash'
import Vue from 'vue'

import GenericLinkElement from './generic-link-element.vue'
import { styleProps } from './style-props'

type withBlockId = VueConstructor<Vue & { blockId: string }>

export default (Vue as withBlockId).extend({
  components: { GenericLinkElement },

  inject: ['blockId'],

  props: {
    component: { type: String, required: true },
    kind: { type: String, required: true },
    blockType: { type: String },
    defaultValue: String,
    dataId: String,

    ...styleProps,
  },

  computed: {
    genericElementProps() {
      const blockClass = `b-${this.blockId}`
      const path = [blockClass, this.kind]
      return {
        ...omit(this.$props, ['kind', 'blockType']),
        editable: true,
        display: 'Input Text',
        path: this.dataId ? [...path, this.dataId] : path,
      }
    },
  },

  created() {
    if ((this as any).blockType) {
      Vue.util.warn('blockType is deprecated', this as any)
    }
  },
})
</script>

<template>
  <GenericLinkElement v-bind="genericElementProps" />
</template>
