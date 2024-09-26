<script lang="ts">
import type { VueConstructor } from 'vue'
import Vue from 'vue'

import { getDesk, putDesk } from './desk-manager'

type withDesk = VueConstructor<Vue & { desk: string }>

export default (Vue as withDesk).extend({
  provide() {
    return {
      desk: this.desk,
    }
  },
  props: {
    /**
     * this is the desk order display in builder. It must be an unique number for each desk in same block
     */
    order: { type: Number, required: true },
  },

  data() {
    return { desk: getDesk() }
  },

  beforeUnmount() {
    putDesk(this.desk)
  },
})
</script>

<template>
  <div>
    <!--
      @slot desk content
      @binding {string} desk desk name
    -->
    <slot :desk="desk" url="#" />
  </div>
</template>
