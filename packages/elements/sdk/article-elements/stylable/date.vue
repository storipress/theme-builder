<script lang="ts">
import dayjs from 'dayjs'
import { omit } from 'lodash'

import { Element } from './base'

const format = (date: Date, formatString: string) => dayjs(date).format(formatString)

export default Element.extend({
  props: {
    format: {
      type: String,
      default: 'MMM-dd-yyyy hh:mma O',
    },
  },

  computed: {
    date(): Date {
      return this.element.date
    },

    datetime(): string {
      return dayjs(this.date).toISOString()
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
