<script lang="ts">
import { computed, defineComponent, inject, ref } from 'vue-demi'

import { useArticleCount } from './article-counter'
import { INJECTED_DEFAULT } from './base-element'

function filterTag(dirtyHTML: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(dirtyHTML, 'text/html')
  return doc.body.textContent || ''
}

export default defineComponent({
  name: 'ArticleBlock',
  setup() {
    const $element = inject('$element', INJECTED_DEFAULT)
    const deskInfo = inject('deskInfo', ref({ name: '', slug: '', url: '' }))
    const blockId = inject('blockId', '')

    const randomKey = `${blockId}_${Math.random().toString(36).slice(-8)}`
    const slotId = Symbol(randomKey)
    const article = $element.dataSource.useDataSource(deskInfo, blockId, slotId)

    useArticleCount()

    return {
      article: computed(() => {
        const { title, blurb } = article.value
        return {
          ...article.value,
          title: filterTag(title),
          blurb: filterTag(blurb),
        }
      }),
    }
  },
})
</script>

<template>
  <div>
    <!--
      @slot display article preview
      @binding {object} article article info
    -->
    <slot :article="article" />
  </div>
</template>
