<script lang="ts">
import { Element } from './base'

export default Element.extend({})
</script>

<template>
  <ArticleElement component="p" kind="article-desk" class="article-desk" :styles="styles">
    {{ $element.desk }}
  </ArticleElement>
</template>
