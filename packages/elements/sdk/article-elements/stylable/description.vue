<script lang="ts">
import { Element } from './base'

export default Element.extend({
  props: {
    kind: {
      type: String,
      default: 'article-description',
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
  <ArticleElement component="p" :kind="kind" :path="path" display="Article Description" :class="kind" :styles="styles">
    {{ element.blurb }}
  </ArticleElement>
</template>
