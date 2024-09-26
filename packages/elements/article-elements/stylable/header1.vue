<script lang="ts">
import { header1 } from '@storipress/elements/common/preview-article'

import { Element } from './base'

export default Element.extend({ data: () => ({ content: header1 }) })
</script>

<template>
  <ArticleElement component="h1" kind="h1" :styles="styles">{{ content }}</ArticleElement>
</template>
