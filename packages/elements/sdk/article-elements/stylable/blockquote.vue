<script lang="ts">
import { quote } from '@storipress/elements/common/preview-article'

import { Element } from './base'

export default Element.extend({ data: () => ({ content: quote }) })
</script>

<template>
  <ArticleElement class="z-10" component="blockquote" kind="blockquote" :styles="styles">{{ content }}</ArticleElement>
</template>
