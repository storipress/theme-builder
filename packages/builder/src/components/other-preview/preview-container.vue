<script lang="ts">
import type { Component } from 'vue'
import type Vue from 'vue'
import type { State } from '../../store/modules/other'
import { Fallback, TEMPLATE_MAP } from '@storipress/templates/other-pages'
import localForage from 'localforage'
import { computed, defineComponent, ref } from 'vue-demi'

import { useState } from 'vuex-hooks'
import { Preview } from '../common/other-previewer'

localForage.config({ name: 'fonts-cache' })

export default defineComponent({
  components: {
    Preview,
  },

  setup() {
    const root = ref<Vue>()
    const { template } = useState<State>('other')

    return {
      root,
      templateName: template,
      template: computed((): Component => {
        return TEMPLATE_MAP[template.value] || Fallback
      }),
    }
  },
})
</script>

<template>
  <Preview ref="root" :class="`preview-${templateName}`" :name="`preview-${templateName}`">
    <component :is="template" />
  </Preview>
</template>
