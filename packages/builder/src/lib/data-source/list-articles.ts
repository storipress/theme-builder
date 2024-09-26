import type { Desk, ResolvedArticle } from './types'
import { Array, Effect, pipe } from 'effect'
import pMemoize from 'p-memoize'
import type { Article, ListArticlesVariables } from '~/api'
import { getSite, listArticles } from '~/api'
import type { ListArticlesQuery } from '~/generated/graphql'
import { store } from '~/store'
import { transformArticles } from './transform-article'

export const canLoadMore = ref(true)

export const memoizedListArticles = pMemoize(async (listArticlesVariables: ListArticlesVariables) => {
  return listArticles(listArticlesVariables)
})

const EACH_PAGE_COUNT = 50

function listArticles$(input: {
  page: number
  first: number
  featured: boolean
  deskIds?: string[]
}): Effect.Effect<ListArticlesQuery['articles']['data']> {
  return pipe(
    Effect.promise(() => memoizedListArticles(input)),
    Effect.tap(({ paginatorInfo }: ListArticlesQuery['articles']) => {
      if (paginatorInfo.hasMorePages) {
        // If there has more article, we will set our flag
        canLoadMore.value = true
      }
    }),
    Effect.map(({ data }) => data),
  )
}

export async function doListArticlesToPage(page: number, desks: Desk[]): Promise<Article[]> {
  const deskIds = pipe(
    desks,
    Array.map((desk) => [desk.id, ...Array.map(desk.desks, (d) => d.id)]),
  )

  // Assume there is no more
  canLoadMore.value = false

  // Safety: has memoized list articles API
  const fetchWhenDeskEmpty = (index: number) => [
    listArticles$({
      page: index + 1,
      first: EACH_PAGE_COUNT,
      featured: false,
    }),
    listArticles$({ page: index + 1, first: EACH_PAGE_COUNT, featured: true }),
  ]

  // will fetch 50 article per desks for use
  const fetchWhenDeskNotEmpty = (index: number) =>
    pipe(
      deskIds,
      Array.map((deskIds) =>
        listArticles$({
          page: index + 1,
          deskIds,
          first: EACH_PAGE_COUNT,
          featured: false,
        }),
      ),
      Array.append(listArticles$({ page: index + 1, first: EACH_PAGE_COUNT, featured: true })),
    )

  const pages = await pipe(
    Array.makeBy(page, deskIds.length > 0 ? fetchWhenDeskNotEmpty : fetchWhenDeskEmpty),
    Array.flatten,
    Effect.allWith({ concurrency: 'unbounded' }),
    Effect.map(Array.flatten),
    Effect.runPromise,
  )
  return pages
}

export function listArticlesToPage(page: number): Promise<Article[]> {
  const storeState = store.state as typeof store.state & { front: { desks: Desk[] } }
  const desks = storeState.front.desks
  return doListArticlesToPage(page, desks)
}

export const getArticlesMap = pMemoize(async (_clientId: string, page: number): Promise<ResolvedArticle[]> => {
  const [site, raw] = await Promise.all([getSite(), listArticlesToPage(page)])

  return transformArticles(raw, site)
})
