<script lang="ts">
import { Portal as VPortal } from 'portal-vue'
import Vue from 'vue'

export default Vue.extend({
  components: { VPortal },
  props: {
    open: {
      type: Boolean,
    },
    openClass: {
      type: String,
      default: 'block',
    },
  },
})
</script>

<template>
  <VPortal to="menu">
    <div class="h-full w-full" :class="open ? openClass : 'hidden'">
      <slot />
    </div>
  </VPortal>
</template>
