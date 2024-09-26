import type { ArticleInjected } from '../inject'

import data from 'data'
import { getFromData, invariant } from '../../common/utils'

export function createProvider(): Omit<ArticleInjected, 'addColor' | 'registerElementDefault'> {
  const article = getFromData(data, 'article')
  invariant(article, 'article is undefined')
  return {
    elements: {},

    desk: article.desk,
    title: article.title,
    blurb: article.blurb,
    authors: article.authors,
    date: article.time as Date,
    headlineAlt: '',
    headlineFocus: { x: 0, y: 0 },
    headlineURL: article.headline,
    headlineCaption: article.headlineCaption || '',
  }
}
