import { createSwitch } from './switch'

export { default as LinkElement } from '../common/link-element.vue'
export { default as ResponsiveImage } from '../common/responsive-image.vue'
export { default as Site } from '../common/site.vue'
export { default as ArticleInfo } from './article-info.vue'
export { default as Logo } from './logo.vue'
export { default as Icon } from 'shared/components/icon.vue'

export const Article = createSwitch('Article')
export const ArticleBlock = createSwitch('ArticleBlock')
export const ArticleContent = createSwitch('ArticleContent')
export const AuthorList = createSwitch('AuthorList')
export const AuthorName = createSwitch('AuthorName')
export const Authors = createSwitch('Authors')
export const Blockquote = createSwitch('Blockquote')
export const ColorArea = createSwitch('ColorArea')
export const Content = createSwitch('Content')
export const Date = createSwitch('Date')
export const Description = createSwitch('Description')
export const Desk = createSwitch('Desk')
export const Header = createSwitch('Header')
export const HeaderBlock = createSwitch('HeaderBlock')
export const Header1 = createSwitch('Header1')
export const Header2 = createSwitch('Header2')
export const HeadlineCaption = createSwitch('HeadlineCaption')
export const HeadlineImage = createSwitch('HeadlineImage')
export const HeadlineWrapper = createSwitch('HeadlineWrapper')
export const Paragraph = createSwitch('Paragraph')
export const Title = createSwitch('Title')
export const TitleElement = createSwitch('TitleElement')
