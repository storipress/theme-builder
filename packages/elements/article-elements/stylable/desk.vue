<script lang="ts">
import { Element } from './base'

export default Element.extend({
  props: {
    kind: {
      type: String,
      default: 'article-desk',
    },
    component: {
      type: String,
      default: 'p',
    },
  },
})
</script>

<template>
  <ArticleElement :component="component" :kind="kind" :class="kind" :styles="styles">
    {{ $element.desk }}
  </ArticleElement>
</template>
