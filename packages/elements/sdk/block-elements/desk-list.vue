<script lang="ts">
import { BaseElement } from './base-element'
import SiteInfo from './site-info.vue'

export default BaseElement.extend({
  components: { SiteInfo },
})
</script>

<template>
  <SiteInfo v-slot="{ desks }">
    <slot :desks="desks" />
  </SiteInfo>
</template>
