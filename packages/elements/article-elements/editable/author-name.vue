<script lang="ts">
import { Element } from './base'

export default Element.extend({})
</script>

<template>
  <ArticleElement component="span" kind="author-name" class="author-name" :styles="styles"><slot /></ArticleElement>
</template>
