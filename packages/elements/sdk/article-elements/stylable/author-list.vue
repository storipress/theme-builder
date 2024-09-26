<script lang="ts">
import type { Author } from '../inject'
import { Element } from './base'

export default Element.extend({
  computed: {
    authors(): Author[] {
      return this.element.authors
    },
  },
})
</script>

<template>
  <ArticleElement
    v-if="authors.length > 0"
    component="article"
    kind="article-author"
    class="article-author"
    :styles="styles"
  >
    <slot />
  </ArticleElement>
</template>
