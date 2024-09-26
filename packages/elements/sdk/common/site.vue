<script lang="ts">
import type { Site } from 'data'
import data from 'data'
import Vue from 'vue'

import { getFromData } from './utils'

export default Vue.extend({
  computed: {
    site(): Site {
      return getFromData(data, 'site')
    },
  },
})
</script>

<template>
  <div>
    <slot :site="site" />
  </div>
</template>
