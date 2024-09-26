import { createPlaceholder } from './placeholder'

export { default as Article } from './article.vue'
export { default as ArticleBlock } from './article.vue'
export { default as ArticleContent } from './article-content.vue'
export { default as AuthorList } from './author-list.vue'
export { default as AuthorName } from './author-name.vue'
export { Authors } from './authors'
export { default as ColorArea } from './color-area.vue'
export { default as Content } from './content.vue'
export { default as Date } from './date.vue'
export { default as Description } from './description.vue'
export { default as Desk } from './desk.vue'
export { default as Header } from './header.vue'
export { default as HeaderBlock } from './header.vue'
export { HeadlineCaption, HeadlineImage } from './headline-image'
export { default as HeadlineWrapper } from './headline-wrapper.vue'
export { default as Title } from './title.vue'
export { default as TitleElement } from './title.vue'

export const Header1 = createPlaceholder('Header1', 'h1')
export const Header2 = createPlaceholder('Header2', 'h2')
export const Paragraph = createPlaceholder('Paragraph', 'p')
export const Blockquote = createPlaceholder('Blockquote', 'blockquote')
