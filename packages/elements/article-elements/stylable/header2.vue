<script lang="ts">
import { header2 } from '@storipress/elements/common/preview-article'

import { Element } from './base'

export default Element.extend({ data: () => ({ content: header2 }) })
</script>

<template>
  <ArticleElement component="h2" kind="h2" :styles="styles">{{ content }}</ArticleElement>
</template>
