<script lang="ts">
export default defineComponent({
  props: {
    width: Number,
    height: Number,
    title: String,
    interactive: Boolean,
  },

  computed: {
    safeWidth() {
      return Math.max(this.width, 0)
    },
    safeHeight() {
      return Math.max(this.height, 0)
    },
    viewBox(): string {
      return `0 0 ${this.safeWidth} ${this.safeHeight}`
    },
  },
})
</script>

<template>
  <svg :viewBox="viewBox" xmlns="http://www.w3.org/2000/svg" overflow="auto" data-marpit-svg="">
    <title v-if="title">{{ title }}</title>
    <foreignObject x="0" y="0" :width="`${safeWidth}`" :height="`${safeHeight}`">
      <section xmlns="http://www.w3.org/1999/xhtml" class="relative h-full" :class="!interactive && 'select-none'">
        <slot />
      </section>
    </foreignObject>
  </svg>
</template>
