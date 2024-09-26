<script lang="ts">
import { UnsplashPicker } from '@storipress/editor-core'
import { defineComponent } from 'vue-demi'

import { downloadPhoto, listPhotos, searchPhotos } from '../../api'

export default defineComponent({
  components: { UnsplashPicker },

  setup() {
    const unsplashClient = {
      listPhotos,
      searchPhotos,
      downloadPhoto,
    }
    return {
      unsplashClient,
    }
  },
})
</script>

<template>
  <UnsplashPicker :client="unsplashClient" />
</template>
