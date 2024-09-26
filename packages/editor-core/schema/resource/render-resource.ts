import type { DOMOutputSpec } from 'prosemirror-model'

import type { Attr, BookmarkMetaContent, EmbedMeta } from './resource-types'
import { h, renderHTML } from '../render-html'
import { safeParse } from '../utils'
import { renderBookmarkImpl as renderBookmarkImplNoThumbnail } from './render-resource-impl'

function renderBookmarkImpl(meta: BookmarkMetaContent): DOMOutputSpec[] {
  return meta.thumbnail
    ? [h('div', { class: 'bookmark__link' }, ...renderHTML(meta.html, true))]
    : renderBookmarkImplNoThumbnail(meta)
}

export function renderBookmark(attr: Attr) {
  const meta: BookmarkMetaContent | null = safeParse(attr.meta)

  if (!meta) {
    return []
  }

  return renderBookmarkImpl(meta)
}

export function renderEmbed(attr: Attr) {
  const meta: EmbedMeta | null = safeParse(attr.meta)
  if (!meta) {
    return []
  }

  return renderHTML(meta.html)
}
