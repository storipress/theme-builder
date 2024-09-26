<script lang="ts">
import { webkit } from '@marp-team/marpit-svg-polyfill'
import { isSafari } from 'shared/utils'
import { defineComponent } from 'vue-demi'

import Imageify from './imageify.vue'
import PreviewFrame from './preview-frame.vue'

export default defineComponent({
  components: { Imageify, PreviewFrame },
  props: {
    path: Object,
    width: Number,
    height: Number,
    interactive: Boolean,
  },
  emits: ['load'],
  data() {
    return {
      stop: false,
    }
  },
  mounted() {
    if (isSafari) {
      this.observer()
    }
  },
  beforeUnmount() {
    this.stop = true
  },
  methods: {
    observer() {
      webkit()
      if (!this.stop) {
        window.requestAnimationFrame(this.observer)
      }
    },
  },
})
</script>

<template>
  <Imageify :interactive="interactive" :width="width" :height="height">
    <PreviewFrame :path="path" :width="`${width}px`" :height="`${height}px`" @load="$emit('load')" />
  </Imageify>
</template>
