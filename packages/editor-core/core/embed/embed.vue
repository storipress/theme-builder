<script lang="ts">
import type { VueConstructor } from 'vue'
import to from 'await-to-js'
import { raf } from 'shared/utils'
import Vue from 'vue'

import { embedify } from './embedify'

type withWrapper = VueConstructor<Vue & { $refs: { wrapper: HTMLElement } }>

export default (Vue as withWrapper).extend({
  data: () => {
    return { html: '' }
  },
  async mounted() {
    const { id, url } = this.$route.query
    document.body.classList.add('bg-white')
    if (!id) {
      return
    }
    const $wrapper = this.$refs.wrapper
    const observer = new ResizeObserver(this.notify)
    observer.observe($wrapper)
    const [, html] = await to(embedify(url as string))
    if (html) {
      this.html = html
    }
  },
  methods: {
    notify() {
      const { id } = this.$route.query
      this.sendMessage(id as string)
    },

    async sendMessage(id: string) {
      if (window.parent === window) {
        return
      }
      const $wrapper = this.$refs.wrapper
      const $iframe = $wrapper.querySelector('iframe')
      if ($iframe) {
        $iframe.width = '100%'
        await raf()
      }
      window.parent.postMessage({ $$source: 'jraft-iframe-wrap', id, height: $wrapper.scrollHeight }, '*')
    },
  },
})
</script>

<template>
  <div ref="wrapper" :class="$style.wrapper" v-html="html" />
</template>

<style lang="scss" module>
.wrapper {
  @apply flex w-full justify-center;

  iframe {
    // stylelint-disable-next-line
    margin: 0 !important;
  }
}
</style>
