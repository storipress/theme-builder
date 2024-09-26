<script lang="ts">
import type { VueConstructor } from 'vue'
import type Vue from 'vue'
import { paragraphs } from '@storipress/elements/common/preview-article'
import { constant, isUndefined, noop, omitBy } from 'lodash'

import { Element } from './base'

type withRegister = VueConstructor<
  Vue & { registerContentElement: (kind: string, $el: Element) => Function[]; $refs: { root: Element } }
>

export default (Element as unknown as withRegister).extend({
  props: {
    order: {
      type: Number,
      required: true,
    },
  },

  data: () => ({
    pseudoElements: [] as Function[],
  }),
  inject: {
    registerContentElement: { default: constant(noop) },
  },
  computed: {
    content(): string {
      return paragraphs[this.order]
    },
    styles(): Record<string, unknown> {
      const { order, ...styles } = this.$props
      return omitBy(styles, isUndefined)
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.pseudoElements = this.registerContentElement('p', this.$el)
    })
  },
})
</script>

<template>
  <ArticleElement component="p" kind="p" :pseudo-elements="pseudoElements" :styles="styles">
    {{ content }}
  </ArticleElement>
</template>
