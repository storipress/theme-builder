import type { Article, MockData } from 'data'
import data from 'data'

import { normalizeLinkableResource } from '../common/utils'

let articles: Record<string, Article[]> = {}

export interface FullArticle extends Article {
  deskUrl: string
}

// this will force rollup to generate namespace import
if (data.onReset) {
  data.onReset(() => {
    articles = {}
  })
}

function populateArticle(desk: string) {
  if (data.getData) {
    doPopulateArticle(desk, data.getData().articles)
    return
  }
  doPopulateArticle(desk, data.articles)
}

function doPopulateArticle(desk: string, source: MockData['articles']) {
  const normalizeArticle = (article: Omit<Article, 'desk'>) => ({
    ...article,
    desk,
    authors: normalizeLinkableResource(article.authors),
  })
  if (Array.isArray(source)) {
    articles[desk] = source.map((article) => normalizeArticle(article))
  } else if (source[desk] && typeof source[desk] === 'object') {
    articles[desk] = source[desk].map((article) => normalizeArticle(article))
  }
}

export function getArticle(desk: string): FullArticle {
  if (!articles[desk] || articles[desk].length === 0) {
    populateArticle(desk)
  }

  return {
    ...((articles[desk] || []).shift() ?? {
      title: `No Article for '${desk}'`,
      blurb: `Could not get article mocking data for '${desk}' desk`,
      desk,
      url: 'https://example.com',
      headline: '',
      time: new Date(),
      authors: [
        {
          name: 'No Article',
          url: '#',
        },
      ],
    }),
    deskUrl: '#',
  }
}

export function putArticle(desk: string, article: Article) {
  articles[desk] ??= []
  articles[desk].push(article)
}
