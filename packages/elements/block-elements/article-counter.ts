import type { InjectionKey } from 'vue'
import { inject, onMounted, provide } from 'vue'
import { useElement } from './base-element'

interface ArticleCount {
  count: number
}

const ArticleCountSymbol: InjectionKey<ArticleCount> = Symbol('ArticleCount')

export function useArticleCountProvider(id: string) {
  const element = useElement()
  const articleCount = { count: 0 }

  provide(ArticleCountSymbol, articleCount)

  onMounted(() => {
    element.value.setArticleCount(id, articleCount.count)
  })
}

export function useArticleCount() {
  const articleCount = inject(ArticleCountSymbol, { count: 0 })
  articleCount.count += 1
}
