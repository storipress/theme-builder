<script lang="ts">
import { PortalTarget as VPortalTarget } from 'portal-vue'
import Vue from 'vue'

export default Vue.extend({
  components: { VPortalTarget },

  provide() {
    return {
      blockId: 'menu',
    }
  },
})
</script>

<template>
  <div class="b-menu">
    <VPortalTarget name="menu" slim />
  </div>
</template>
