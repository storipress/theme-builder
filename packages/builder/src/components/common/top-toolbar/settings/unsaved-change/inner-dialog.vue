<script lang="ts">
import { Portal } from 'portal-vue'
import { defineComponent } from 'vue-demi'

import Overlay from './inner-overlay.vue'

export default defineComponent({
  components: { Portal, Overlay },
})
</script>

<template>
  <Portal to="saveWarning">
    <Overlay v-on="$listeners">
      <slot />
    </Overlay>
  </Portal>
</template>
