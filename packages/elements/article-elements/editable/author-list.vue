<script lang="ts">
import { Element } from './base'

export default Element.extend({})
</script>

<template>
  <ArticleElement component="article" kind="article-author" class="article-author" :styles="styles">
    <slot />
  </ArticleElement>
</template>
