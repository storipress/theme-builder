<script lang="ts">
import { defineComponent } from 'vue-demi'

import CircleProgressDeterminate from './circular-progress-determinate.vue'
import CircleProgressIndeterminate from './circular-progress-indeterminate.vue'

export default defineComponent({
  name: 'CircularProgress',
  components: {
    CircleProgressDeterminate,
    CircleProgressIndeterminate,
  },

  props: {
    value: {
      type: [Number, String],
    },
    max: {
      type: Number,
    },
    indeterminate: {
      type: Boolean,
    },
  },
})
</script>

<template>
  <CircleProgressIndeterminate v-if="indeterminate" />
  <CircleProgressDeterminate v-else :value="value" :max="max" />
</template>
