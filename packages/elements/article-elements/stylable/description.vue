<script lang="ts">
import { Element } from './base'

export default Element.extend({
  props: {
    kind: { type: String, default: 'article-description' },
  },

  computed: {
    path(): string[] {
      return ['article', this.kind]
    },
  },
})
</script>

<template>
  <ArticleElement component="p" :kind="kind" :class="kind" display="Article Description" :styles="styles">
    {{ $element.blurb }}
  </ArticleElement>
</template>
