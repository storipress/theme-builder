<script lang="ts">
import type { Focus } from '@storipress/image-focus'
import type { VueConstructor } from 'vue'
import { FocusPicker } from '@storipress/image-focus'
import Vue from 'vue'

type withPicker = VueConstructor<Vue & { focusPicker: FocusPicker }>

export default (Vue as withPicker).extend({
  props: {
    alt: {
      type: String,
      default: 'image',
    },

    src: {
      type: String,
    },

    value: {
      type: Object,
      default: (): Focus => ({ x: 0, y: 0 }),
    },
  },

  watch: {
    value(value?: Focus, old?: Focus) {
      if (value && value !== old) {
        this.focusPicker.setFocus(value)
      }
    },
  },

  mounted() {
    this.focusPicker = new FocusPicker(this.$refs.img as HTMLImageElement, {
      onChange: (focus) => {
        this.$emit('input', focus)
      },
      focus: this.value,
    })
  },

  beforeUnmount() {
    this.focusPicker.stopListening()
    this.focusPicker.retina.remove()
  },
})
</script>

<template>
  <div>
    <img ref="img" :alt="alt" :src="src" />
  </div>
</template>
