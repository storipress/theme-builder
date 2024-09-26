<script lang="ts">
import { Element } from './base'

export default Element.extend({
  props: {
    kind: {
      type: String,
      default: 'article-title',
    },
  },

  computed: {
    path(): string[] {
      return ['article', this.kind]
    },
  },
})
</script>

<template>
  <ArticleElement component="h1" :kind="kind" :path="path" display="Article Title" :class="kind" :styles="styles">
    {{ element.title }}
  </ArticleElement>
</template>
