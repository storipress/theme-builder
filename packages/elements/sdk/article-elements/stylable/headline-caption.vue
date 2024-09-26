<script lang="ts">
import { Element } from './base'

export default Element.extend({ props: { component: { type: String, default: 'p' } } })
</script>

<template>
  <ArticleElement :component="component" kind="headline-caption" class="headline-caption" :styles="styles">
    {{ element.headlineCaption }}
  </ArticleElement>
</template>
