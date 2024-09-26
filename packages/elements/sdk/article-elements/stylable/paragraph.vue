<script lang="ts">
import { paragraphs } from '@storipress/elements/common/preview-article'
import { isUndefined, omitBy } from 'lodash'

import { Element } from './base'

export default Element.extend({
  props: {
    order: {
      type: Number,
      required: true,
    },
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
})
</script>

<template>
  <ArticleElement component="p" kind="p" :styles="styles">{{ content }}</ArticleElement>
</template>
