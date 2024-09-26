import type { Article } from '~/api'

export interface Identifiable {
  id: string
}

export interface Author extends Identifiable {
  name: string
  url: string
}

export interface Desk extends Identifiable {
  name: string
  slug: string
  url: string
  desks: Identifiable[]
}

export interface ResolvedArticle extends Omit<Article, 'desk' | 'authors' | 'updated_at'> {
  url: string
  time: Date
  desk: string
  featured: boolean
  blurb: string
  deskUrl: string
  _desk: Article['desk']
  headline: string
  headlineAlt: string
  excerpt: string
  authors: Author[]
}
