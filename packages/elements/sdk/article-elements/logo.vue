<script lang="ts">
import data from 'data'
import { defineComponent } from 'vue-demi'

import { getFromData } from '../common/utils'

export default defineComponent({
  setup() {
    return {
      logo: getFromData(data, 'logo'),
    }
  },
})
</script>

<template>
  <img v-if="logo" :src="logo" alt="logo" />
</template>
