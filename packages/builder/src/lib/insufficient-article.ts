import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { ref, set } from 'vue'

export const useInsufficientArticleStore = defineStore(
  'insufficientArticle',
  () => {
    const articleCount: Ref<Record<string, number>> = ref({})

    const setArticleCount = (blockId: string, count: number) => {
      set(articleCount.value, blockId, count)
    }

    return {
      articleCount,
      setArticleCount,
    }
  },
  {
    sync: {
      enabled: true,
    },
  },
)
