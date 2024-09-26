import { clientID } from '../../client'
import BlockBookmark from './assets/block-bookmark.svg'
import BlockBulletList from './assets/block-bullet-list.svg'
import BlockDivider from './assets/block-divider.svg'
import BlockGallery from './assets/block-gallery.svg'
import BlockH1 from './assets/block-h1.svg'
import BlockH2 from './assets/block-h2.svg'
import BlockHtmlEmbed from './assets/block-html-embed.svg'
import BlockNumberedList from './assets/block-numbered-list.svg'
import BlockPhoto from './assets/block-photo.svg'
import BlockQuote from './assets/block-quote.svg'
import BlockText from './assets/block-text.svg'
import Codepen from './assets/type-codepen.svg'
import Instagram from './assets/type-instagram.svg'
import SoundCloud from './assets/type-soundcloud.svg'
import Spotify from './assets/type-spotify.svg'
import Twitter from './assets/type-twitter.svg'
import Unsplash from './assets/type-unsplash.svg'
import Vimeo from './assets/type-vimeo.svg'
import Youtube from './assets/type-youtube.svg'

type FloatingCommands =
  | 'clearNodes'
  | 'setHorizontalRule'
  | 'toggleBulletList'
  | 'setImage'
  | 'setGallery'
  | 'setEmbed'
  | 'setResource'
  | 'toggleBlockquote'
  | 'toggleHeading'
  | 'toggleBulletList'
  | 'toggleOrderedList'

export interface Format {
  action: FloatingCommands
  options?: object
  [key: string]: unknown
}

export const primary: readonly Format[] = Object.freeze([
  {
    name: 'Text',
    action: 'clearNodes',
    component: BlockText,
  },
  {
    name: 'Divider',
    action: 'setHorizontalRule',
    component: BlockDivider,
  },
  {
    name: 'Bulleted',
    action: 'toggleBulletList',
    component: BlockBulletList,
  },
  {
    name: 'Photo',
    action: 'setImage',
    component: BlockPhoto,
  },
  {
    name: 'Bookmark',
    action: 'setResource',
    component: BlockBookmark,
    options: { type: 'bookmark' },
  },
  {
    name: 'H1',
    action: 'toggleHeading',
    component: BlockH1,
    options: { level: 1 },
  },
  {
    name: 'Quote',
    action: 'toggleBlockquote',
    component: BlockQuote,
  },
  {
    name: 'Numbered',
    action: 'toggleOrderedList',
    component: BlockNumberedList,
  },
  {
    name: 'Gallery',
    action: 'setGallery',
    component: BlockGallery,
  },
  {
    name: 'HTML',
    action: 'setEmbed',
    component: BlockHtmlEmbed,
    options: { name: 'html' },
  },
  {
    name: 'H2',
    action: 'toggleHeading',
    component: BlockH2,
    options: { level: 2 },
  },
])

export const embed: readonly Format[] = Object.freeze([
  {
    name: 'Unsplash',
    description: 'License free photos',
    action: 'setImage',
    component: Unsplash,
    options: {
      provider: 'unsplash',
      cid: clientID,
    },
  },
  {
    name: 'Twitter',
    description: 'Insert tweet or account',
    action: 'setResource',
    component: Twitter,
    options: { type: 'embed', target: 'twitter' },
  },
  {
    name: 'Youtube',
    description: 'Insert a YouTube video',
    action: 'setResource',
    component: Youtube,
    options: { type: 'embed', target: 'youtube' },
  },
  {
    name: 'Instagram',
    description: 'Insert photo or account',
    action: 'setResource',
    component: Instagram,
    options: { type: 'embed', target: 'instagram' },
  },
  {
    name: 'Vimeo',
    description: 'Insert a Vimeo video',
    action: 'setResource',
    component: Vimeo,
    options: { type: 'embed', target: 'vimeo' },
  },
  {
    name: 'Codepen',
    description: 'Embed a Codepen',
    action: 'setResource',
    component: Codepen,
    options: { type: 'embed', target: 'codepen' },
  },
  {
    name: 'Spotify',
    description: 'Insert a song or playlist',
    action: 'setResource',
    component: Spotify,
    options: { type: 'embed', target: 'spotify' },
  },
  {
    name: 'SoundCloud',
    description: 'Insert a song or playlist',
    action: 'setResource',
    component: SoundCloud,
    options: { type: 'embed', target: 'soundcloud' },
  },
])
