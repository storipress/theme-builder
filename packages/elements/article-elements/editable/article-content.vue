<script lang="ts">
import Vue from 'vue'

import Content from './content.vue'

export default Vue.extend({
  components: { Content },
})
</script>

<template>
  <Content>
    <slot />
  </Content>
</template>
