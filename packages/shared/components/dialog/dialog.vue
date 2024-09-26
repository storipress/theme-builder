<script lang="ts">
import { Portal } from 'portal-vue'
import Vue from 'vue'

import Overlay from './overlay.vue'

export default Vue.extend({ components: { Portal, Overlay } })
</script>

<template>
  <Portal to="dialog">
    <Overlay v-on="$listeners">
      <slot />
    </Overlay>
  </Portal>
</template>
