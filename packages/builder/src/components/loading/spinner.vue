<script lang="ts">
import { defineComponent } from 'vue-demi'

import spinnerIcon from './loading-spinner.svg?external'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    tip: {
      type: String,
      require: false,
    },
    tipColor: {
      type: String,
      default: 'text-black',
    },
    spinWidth: {
      type: String,
      default: 'w-16',
    },
  },
  setup() {
    return { spinnerIcon }
  },
})
</script>

<template>
  <div v-if="show" class="flex flex-col items-center">
    <img :class="spinWidth" class="animate-spin" :src="spinnerIcon" alt="Loading spinner" />
    <div v-if="tip" :class="tipColor" class="mt-6">
      {{ tip }}
    </div>
  </div>
</template>
