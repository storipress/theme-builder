<script lang="ts">
import type { Component } from 'vue'
import type Vue from 'vue'
import { Fallback, TEMPLATE_MAP } from '@storipress/templates/articles'
import { computed, defineComponent, ref } from 'vue-demi'

import Imageify from '../imageify.vue'
import Preview from './preview.vue'

export default defineComponent({
  components: {
    Imageify,
    Preview,
  },

  props: {
    templateName: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
    },
  },

  setup(props) {
    const root = ref<Vue>()

    return {
      root,
      template: computed((): Component => {
        return TEMPLATE_MAP[props.templateName] || Fallback
      }),
    }
  },
})
</script>

<template>
  <Imageify :height="2000" :width="1280" :interactive="false" :title="templateName">
    <Preview
      ref="root"
      :key="templateName"
      :class="`preview-${templateName}`"
      :selectable="false"
      :name="`preview-${templateName}`"
      :data="data"
    >
      <component :is="template" />
    </Preview>
  </Imageify>
</template>
