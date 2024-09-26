<script lang="ts">
import { Portal } from 'portal-vue'

import Overlay from './overlay.vue'

export default defineComponent({ components: { Portal, Overlay }, props: { center: Boolean, visable: Boolean } })
</script>

<template>
  <Portal to="dialog">
    <transition name="fade">
      <Overlay v-if="visable" :center="center" v-on="$listeners">
        <slot />
      </Overlay>
    </transition>
  </Portal>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
