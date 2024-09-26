<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<template>
  <div role="progressbar" aria-valuemax="1" aria-valuemin="0">
    <svg class="circular">
      <circle class="value" cx="50" cy="50" r="47" fill="none" stroke-width="3" stroke-miterlimit="10" />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

$grassy-green: #44a604;
$width: 100px;

.circular {
  animation: rotate 3s linear infinite;
  height: $width;
  position: relative;
  width: $width;
}

.value {
  stroke-dasharray: 1, 500;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite;
  stroke-linecap: round;
  stroke-width: 6px;
  stroke: color.adjust($grassy-green, $lightness: 20%);
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 500;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 500;
    stroke-dashoffset: -70;
  }
  100% {
    stroke-dasharray: 89, 500;
    stroke-dashoffset: -294;
  }
}
</style>
