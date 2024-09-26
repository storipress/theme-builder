<script lang="ts">
import data from 'data'

import Site from '../common/site.vue'
import { getFromData, normalizeLinkableResource } from '../common/utils'
import { BaseElement } from './base-element'
import { listDesks } from './desk-manager'

export default BaseElement.extend({
  components: { Site },

  computed: {
    desks() {
      return listDesks()
    },

    pages() {
      return normalizeLinkableResource(getFromData(data, 'pages') ?? [])
    },
  },
})
</script>

<template>
  <Site v-slot="{ site }">
    <slot :site="site" :desks="desks" :pages="pages" />
  </Site>
</template>
