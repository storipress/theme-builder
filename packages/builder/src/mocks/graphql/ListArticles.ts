import { Array } from 'effect'
import { graphql, HttpResponse } from 'msw'
import type { ListArticlesQuery } from '~/generated/graphql'
import { ListArticles } from '~/generated/graphql'

const mockArticle: ListArticlesQuery['articles']['data'][number] = {
  id: '1',
  created_at: '2022-01-01',
  title: 'title',
  desk: {
    id: '1',
    name: 'desk',
    slug: 'desk',
    desk: null,
  },
  authors: [],
  featured: false,
  blurb: '',
  published: true,
  slug: 'slug',
  stage: {
    ready: true,
  },
  cover: null,
  document: null,
  published_at: '2020-01-01',
  seo: null,
}

// parent desk can't have article, thus covert to subdesk id
// ref: ./ListDesks.ts
const deskMapping = new Map([
  [2, 4],
  [3, 6],
])

const mockArticles = Array.makeBy(10, (index) => {
  const deskId = (index % 6) + 1
  return {
    ...mockArticle,
    id: String(index + 1),
    desk: {
      ...mockArticle.desk,
      id: String(deskMapping.get(deskId) ?? deskId),
    },
  }
})

export const handler = graphql.query(ListArticles, ({ variables }) => {
  const deskIds = variables.desk_ids
  if (deskIds) {
    return HttpResponse.json({
      data: {
        articles: {
          paginatorInfo: {
            hasMorePages: false,
          },
          data: mockArticles.filter((article) => deskIds.includes(article.desk.id)),
        },
      },
    })
  }

  return HttpResponse.json({
    data: {
      articles: {
        paginatorInfo: {
          hasMorePages: false,
        },
        data: mockArticles,
      },
    },
  })
})
