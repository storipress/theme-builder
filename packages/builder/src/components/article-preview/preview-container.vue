<script lang="ts">
import type { Component } from 'vue'
import type { State } from '../../store/modules/article'
import { Fallback, TEMPLATE_MAP } from '@storipress/templates/articles'
import { computed, defineComponent } from 'vue-demi'

import { useState } from 'vuex-hooks'
import { Preview } from '../common/article-previewer'

export default defineComponent({
  components: {
    Preview,
  },

  setup() {
    const { template } = useState<State>('article')

    return {
      templateName: template,
      template: computed((): Component => {
        return TEMPLATE_MAP[template.value] || Fallback
      }),
    }
  },
})
</script>

<template>
  <Preview :key="templateName" :class="`preview-${templateName}`" :name="`preview-${templateName}`">
    <component :is="template" />
  </Preview>
</template>
