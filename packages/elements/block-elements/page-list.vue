<script lang="ts">
import { defineComponent } from 'vue-demi'

import SiteInfo from './site-info.vue'

export default defineComponent({
  components: { SiteInfo },
})
</script>

<template>
  <SiteInfo v-slot="{ pages }">
    <slot :pages="pages" />
  </SiteInfo>
</template>
