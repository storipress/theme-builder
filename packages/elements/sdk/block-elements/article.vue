<script lang="ts">
import type { VueConstructor } from 'vue'
import type { FullArticle } from './article-manager'

import Vue from 'vue'
import { getArticle, putArticle } from './article-manager'

type withDesk = VueConstructor<Vue & { desk: string }>

/**
 * An article showcase
 */
export default (Vue as withDesk).extend({
  inject: ['desk'],
  data: () => ({
    article: {
      title: '',
      headline: '',
      desk: '',
      deskUrl: '#',
      authors: [],
      blurb: '',
      url: '',
      time: new Date(),
    } as FullArticle,
  }),

  async created() {
    if (!this.desk) {
      throw new Error('please make sure you use `Article` inside a `DeskSection`')
    }
    this.article = getArticle(this.desk)
  },

  beforeUnmount() {
    if (this.article.title) {
      putArticle(this.desk, Object.assign({}, this.article))
    }
  },
})
</script>

<template>
  <div>
    <slot :article="article" />
  </div>
</template>
