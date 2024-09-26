<script lang="ts">
import { computed, defineComponent } from 'vue-demi'

import { useRoute } from '../../lib/hooks'
import Viewport from '../common/viewport.vue'
import { useLoadingStore } from '../loading'

export default defineComponent({
  components: { Viewport },
  props: {
    iFrameWidth: { type: Number, required: true },
    iFrameHeight: { type: Number, required: true },
  },

  setup() {
    const route = useRoute()

    const previewPath = computed(() => {
      return {
        name: 'front-preview',
        params: { clientID: route.value.params.clientID },
      }
    })

    const loadingStore = useLoadingStore()

    const handleLoad = loadingStore.waitUntil()

    return {
      previewPath,
      handleLoad,
    }
  },
})
</script>

<template>
  <Viewport :path="previewPath" :width="iFrameWidth" :height="iFrameHeight" @load="handleLoad" />
</template>
