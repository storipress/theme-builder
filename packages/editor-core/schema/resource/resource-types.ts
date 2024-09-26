export interface BookmarkMetaContent {
  author?: string
  description?: string
  icon?: string
  publisher?: string
  title?: string
  url?: string
  thumbnail?: string
  html: string
}

export interface EmbedMeta {
  html: string

  provider_name: string
  type: string
}

export interface Attr {
  meta?: string
}
