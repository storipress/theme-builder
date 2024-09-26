import type { ResolvedArticle } from './types'
import { render } from '@storipress/editor-core/schema/schema-only'
import { compareDesc, formatISO, parseISO, parseJSON } from 'date-fns'
import { nanoid } from 'nanoid'
import { resolveSEOFromRaw } from 'shared/seo'
import { fromHTML } from 'shared/to-description'
import { isPublished } from 'shared/utils/article'
import type { Article, Site } from '~/api'
import { getImageDataUrl } from '../linear-gradients'

export const hasEmptyArticle = ref(false)

export function transformArticles(raw: Article[], site: Site) {
  const publishedArticles = raw.filter((article) => isPublished(article))
  publishedArticles.sort((a, b) => compareDesc(parseJSON(a.published_at), parseJSON(b.published_at)))

  return publishedArticles.map((article): ResolvedArticle => {
    const desk = resolveDesk(article)
    try {
      const authors = article.authors.map(({ id, name }) => ({ id, name: name || '', url: '#' }))

      let excerpt

      try {
        // this required a completely DOM implementation
        excerpt = fromHTML(render(article.document?.default))
      } catch {
        excerpt = ''
      }

      const seo = resolveSEOFromRaw({
        name: site.name,
        base: { title: article.title, description: excerpt },
        seo: article.seo,
      })

      return {
        ...article,
        url: '#',
        // should keep subdesk name
        desk: article.desk.name,
        // rollup to root desk
        deskUrl: `/${desk.slug}`,
        // rollup to root desk
        _desk: desk,
        featured: article.featured,
        time: parseISO(article.created_at),
        headline: article.cover?.url ?? getImageDataUrl(),
        headlineAlt: article.cover?.alt ?? '',
        blurb: article.blurb || seo.meta.description || '',
        excerpt,
        authors,
      }
    } catch (error) {
      return createEmptyArticle(desk.name, desk.slug)
    }
  })
}

function resolveDesk(article: Article) {
  return article.desk?.desk || article.desk
}

export function createEmptyArticle(name: string, slug = ''): ResolvedArticle {
  const isFeatured = slug === 'featured'
  const time = new Date()

  hasEmptyArticle.value = true

  return {
    id: nanoid(),
    desk: name,
    url: '#',
    deskUrl: `/${slug}`,
    _desk: {
      id: '0',
      name,
      slug,
    },
    slug,
    title: isFeatured
      ? 'You have insufficient featured articles.'
      : 'There are insufficient articles to fill this block and block will be hidden on live site',
    blurb: '',
    cover: { url: getImageDataUrl() },
    document: [],
    created_at: formatISO(time),
    published: true,
    featured: false,
    stage: {
      ready: true,
    },
    time,
    headline: getImageDataUrl(),
    headlineAlt: '',
    excerpt: '',
    authors: [],
  }
}
