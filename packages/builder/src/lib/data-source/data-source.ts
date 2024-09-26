import type { Ref } from 'vue-demi'
import type { Desk, ResolvedArticle } from './types'
import { freeze } from 'immer'
import { noop } from 'lodash-es'
import invariant from 'tiny-invariant'
import { computed, ref, toRef, watch, watchEffect } from 'vue-demi'
import { store } from '~/store'
import { createEmptyArticle } from './transform-article'

interface ArticleIndexDeskRecord {
  [desk: string]: number[]
}

interface BlockDeskUpdateSignal {
  blocks: string[]
  desks: string[][]
}

interface ArticleUsageStatus {
  blockIndex: number
  slotId: symbol
}

function articleIndexGroupByDesk(articles: ResolvedArticle[]) {
  return articles.reduce(
    (acc, article, i) => {
      const desk = article._desk.slug
      if (article.featured) acc.featured.push(i)
      if (!acc[desk]) acc[desk] = []
      acc[desk].push(i)

      return acc
    },
    { featured: [] } as ArticleIndexDeskRecord,
  )
}

function findDiffIndex(a: BlockDeskUpdateSignal | null, b?: BlockDeskUpdateSignal | null) {
  if (!a || !b) return 0

  const length = Math.max(a.blocks.length, b.blocks.length)
  for (let i = 0; i < length; i++) {
    if (a.blocks[i] !== b.blocks[i] || `${a.desks[i]}` !== `${b.desks[i]}`) return i
  }

  return 0
}

export interface DataSource {
  source: Ref<ResolvedArticle[]>
  setSource: (source: ResolvedArticle[]) => void
  useDataVersion: () => Ref<number>
  useDataSource: (deskInfo: Ref<Desk>, blockId: string, slotId: symbol) => Ref<ResolvedArticle>
  repopulateDataSource: (signal: BlockDeskUpdateSignal | null) => void
}

const isMainFrame = window.top === window
// check is preview page for debug
const isDataSourceAvailable = isMainFrame && !window.location.href.endsWith('front-preview')

const mockDataSource: DataSource = {
  source: ref([]),
  useDataVersion() {
    throw new Error('not implemented')
  },
  useDataSource() {
    throw new Error('not implemented')
  },
  setSource: noop,
  repopulateDataSource: noop,
}

export function createDataSource(signal: Ref<BlockDeskUpdateSignal | null>, refresh: () => void = noop): DataSource {
  // return mock
  if (isDataSourceAvailable) {
    return mockDataSource
  }
  const dataVersion = ref(0)
  const source: Ref<ResolvedArticle[]> = ref(freeze([]))
  const currentSignal: Ref<BlockDeskUpdateSignal | null> = ref(signal.value)
  const articleUsageStatus: Ref<(ArticleUsageStatus | null)[]> = ref([])
  const hasEmptyArticle = ref(false)
  let deskArticlesMap: ArticleIndexDeskRecord = {}

  function repopulateDataSource(signal: BlockDeskUpdateSignal | null) {
    const diffIndex = signal ? findDiffIndex(currentSignal.value, signal) : 0

    articleUsageStatus.value = articleUsageStatus.value.map((a) => (a !== null && a.blockIndex >= diffIndex ? null : a))
    invariant(articleUsageStatus.value.length === source.value.length)
    if (signal) {
      currentSignal.value = signal
    }
    dataVersion.value += 1
  }

  function updateArticleStatus(articleIndex: number, blockIndex: number, slotId: symbol) {
    articleUsageStatus.value[articleIndex] = {
      blockIndex,
      slotId,
    }
  }

  watch(() => signal.value, repopulateDataSource)

  return {
    source,
    setSource(newSource: ResolvedArticle[]) {
      hasEmptyArticle.value = false
      source.value = freeze(newSource)
      deskArticlesMap = articleIndexGroupByDesk(source.value)
      articleUsageStatus.value = source.value.map(() => null)

      repopulateDataSource(signal.value)
    },
    useDataVersion() {
      return dataVersion
    },
    useDataSource(deskInfo: Ref<Desk>, blockId: string, slotId: symbol) {
      const articlesLength = source.value.length

      const blockIndex = computed(() => currentSignal.value?.blocks.indexOf(blockId) ?? -1)

      const latestArticleIndex = computed(() => {
        if ((articleUsageStatus.value[articlesLength - 1]?.blockIndex ?? -1) > blockIndex.value) {
          return articlesLength - 1
        }
        return articleUsageStatus.value.indexOf(null)
      })

      const articleIndex = computed(() => {
        const { slug: deskSlug } = deskInfo.value
        let temp = -1

        if (deskSlug === 'latest') {
          temp = latestArticleIndex.value
        } else if (deskArticlesMap[deskSlug]) {
          temp = deskArticlesMap[deskSlug].find((a) => articleUsageStatus.value[a] === null) ?? -1
        }
        return temp
      })

      const res = ref()

      watchEffect(() => {
        const { name: deskName, slug: deskSlug } = deskInfo.value
        if (blockIndex.value === -1 || articleIndex.value === -1) {
          res.value = createEmptyArticle(deskName, deskSlug)
        }

        const usedArticleIndex = articleUsageStatus.value.findIndex((a) => a && a.slotId === slotId)
        if (usedArticleIndex > -1) {
          res.value = source.value[usedArticleIndex]
        }

        updateArticleStatus(articleIndex.value, blockIndex.value, slotId)

        res.value = source.value[articleIndex.value] ?? createEmptyArticle(deskName, deskSlug)

        if (articleIndex.value >= 0) {
          for (let i = articleIndex.value; i >= 0; i -= 1) {
            // detect abnormal order
            if ((articleUsageStatus.value[i]?.blockIndex ?? -1) > blockIndex.value) {
              refresh()
              break
            }
          }
        }
      })

      return res
    },
    repopulateDataSource,
  }
}

export const dataSource = createDataSource(toRef(store.getters, 'front/shouldRepopulateValues'), () =>
  store.dispatch('front/refreshBlocks'),
)

const { setSource, repopulateDataSource, useDataSource, useDataVersion } = dataSource

export { repopulateDataSource, setSource, useDataSource, useDataVersion }
