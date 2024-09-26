export interface Author {
  name: string
  url: string
}

export interface Article {
  title: string
  blurb: string
  desk: string
  url: string
  time: unknown
  headline: string
  headlineCaption?: string
  headlineAlt?: string
  authors: Author[]
}

export interface Site {
  name: string
  description?: string | null
  facebook?: string | null
  twitter?: string | null
}

export interface DeskArticleMap {
  [desk: string]: Omit<Article, 'desk'>[]
}

export interface MockData {
  logo?: string
  site?: Site
  desks: string[]
  pages?: string[]
  article?: Article
  articles: Omit<Article, 'desk'>[] | DeskArticleMap
  spacing?: string | { xs?: string; md?: string; lg?: string }
}
