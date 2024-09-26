<script lang="ts">
import { PortalTarget } from 'portal-vue'
import Vue from 'vue'

export default Vue.extend({
  components: { PortalTarget },
})
</script>

<template>
  <PortalTarget name="dialog" />
</template>
