<script lang="ts">
import { Portal } from 'portal-vue'

import Overlay from './inner-overlay.vue'

export default defineComponent({
  components: { Portal, Overlay },
  props: {
    center: Boolean,
    width: String,
  },
})
</script>

<template>
  <Portal to="deletePages">
    <Overlay :center="center" :widthof-dialog="width" v-on="$listeners">
      <slot />
    </Overlay>
  </Portal>
</template>
