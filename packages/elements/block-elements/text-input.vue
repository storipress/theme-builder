<script lang="ts">
import { omit } from 'lodash'
import { computed, defineComponent, inject, warn } from 'vue-demi'

import { compositionStyleProps } from '../utils/style-props'
import GenericLinkElement from './generic-link-element.vue'

export default defineComponent({
  components: { GenericLinkElement },

  props: {
    component: String,
    kind: String,
    blockType: String,
    dataId: { type: String, default: null },
    isLink: Boolean,
    defaultValue: String,

    ...compositionStyleProps,
  },

  setup(props) {
    if (props.blockType) {
      warn('blockType is deprecated')
    }

    const blockId = inject<string>('blockId') as string
    const genericElementProps = computed(() => {
      const path = [`b-${blockId}`, props.kind]
      return {
        ...omit(props, ['kind', 'blockType']),
        display: 'Input Text',
        editable: true,
        path,
        dataId: props.dataId,
      }
    })

    return {
      genericElementProps,
    }
  },
})
</script>

<template>
  <GenericLinkElement v-bind="genericElementProps" />
</template>
