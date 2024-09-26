<script lang="ts">
import type { VueConstructor } from 'vue'
import Vue from 'vue'

import { CircleProgress } from './circular-progress'

type withCircularProgress = VueConstructor<Vue & { circleProgress: CircleProgress }>

export default (Vue as withCircularProgress).extend({
  props: {
    value: {
      type: [Number, String],
    },
    max: {
      type: Number,
    },
  },

  watch: {
    value(val: number) {
      this.circleProgress.value = val
    },
    max(val: number) {
      this.circleProgress.max = val
    },
  },

  mounted() {
    this.circleProgress = new CircleProgress(this.$el, {
      value: this.value,
      max: this.max,
      textFormat: 'percent',
    })
  },
})
</script>

<template>
  <div></div>
</template>

<style lang="scss">
@use 'sass:color';

$grassy-green: #44a604;

.circle-progress-value {
  stroke-width: 6px;
  stroke: color.adjust($grassy-green, $lightness: 20%);
}

.circle-progress-circle {
  stroke-width: 6px;
  stroke: color.adjust($grassy-green, $lightness: 50%);
}

.circle-progress-text {
  fill: color.adjust($grassy-green, $lightness: 80%);
}
</style>
