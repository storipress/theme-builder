<script lang="ts">
import { format, formatISO } from 'date-fns'
import { omit } from 'lodash'

import { Element } from './base'

export default Element.extend({
  props: {
    format: {
      type: String,
      default: 'MMM-dd-yyyy hh:mma O',
    },
  },

  computed: {
    date(): Date {
      return this.$element.date
    },

    datetime(): string {
      return formatISO(this.date)
    },

    display(): string {
      return format(this.date, this.format)
    },

    styleWithoutFormat(): Record<string, unknown> {
      return omit(this.styles, 'format')
    },
  },
})
</script>

<template>
  <ArticleElement component="p" kind="article-date" class="article-date" :styles="styleWithoutFormat">
    <time :datetime="datetime">{{ display }}</time>
  </ArticleElement>
</template>
