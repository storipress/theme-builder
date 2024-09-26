<script lang="ts">
import { BaseElement } from './base-element'
import SiteInfo from './site-info.vue'

export default BaseElement.extend({
  components: { SiteInfo },
})
</script>

<template>
  <SiteInfo v-slot="{ pages }">
    <slot :pages="pages" />
  </SiteInfo>
</template>
