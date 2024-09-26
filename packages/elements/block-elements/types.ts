export interface Author {
  name: string
  url: string
}

export interface Article {
  desk: string
  deskUrl: string
  headline: string
  title: string
  blurb: string
  url: string
  time: Date
  authors: Author[]
}
