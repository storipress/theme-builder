<script lang="ts">
import { ResponsiveImage } from '@storipress/elements/common'
import { computed, defineComponent } from 'vue-demi'

import { useArticleElement } from './inject'

export default defineComponent({
  components: { ResponsiveImage },

  setup() {
    const $element = useArticleElement()

    const logo = computed(() => $element.value.logo)

    return {
      logo,
    }
  },
})
</script>

<template>
  <ResponsiveImage v-if="logo" :src="logo" alt="logo" />
</template>
