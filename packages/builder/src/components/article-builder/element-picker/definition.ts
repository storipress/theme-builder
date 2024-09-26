import type { Component } from 'vue'
import { BLOCKQUOTES } from '@storipress/templates/other-blocks/blockquote'
import { DROPCAPS } from '@storipress/templates/other-blocks/dropcap'
import { dedent } from 'ts-dedent'

import ReadMoreList from './read-more/list.vue'
import ReadMorePicture from './read-more/picture.vue'
import ReadMoreRight from './read-more/right.vue'
import { SubscribeBlock, SubscribeCenter, SubscribeQuote, SubscribeWide } from './subscribe'

interface BaseTemplateDescriptor {
  col: number
  card: 'square' | 'wide'
  name: string
}

interface TemplateComponent {
  name: string
  component: Component
  components?: undefined
}

interface StyleTemplateDescriptor extends BaseTemplateDescriptor {
  kinds: string[]
  component: string
  text: string
  components?: undefined
}

interface ComponentTemplateDescriptor extends BaseTemplateDescriptor {
  component?: undefined
  components: TemplateComponent[]
}

export type TemplateDescriptor = StyleTemplateDescriptor | ComponentTemplateDescriptor

type Templates = Record<string, TemplateDescriptor>

export const ITEMS: Templates = {
  'drop-cap': {
    col: 3,
    card: 'square',
    name: 'dropcap',
    kinds: Object.keys(DROPCAPS),
    component: 'p',
    text: dedent`Article body lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos magni quo deleniti illum error ea officiis
      eveniet optio quisquam molestiae neque, explicabo voluptas excepturi quod, inventore, dolorum corporis non eaque!`,
  },
  quote: {
    col: 2,
    card: 'wide',
    name: 'blockquote',
    kinds: Object.keys(BLOCKQUOTES),
    component: 'blockquote',
    text: dedent`This is your quote block. Lorem ipsum, dolor sit amet consectetur adipisicing elit.`,
  },
  subscribe: {
    col: 2,
    card: 'wide',
    name: 'subscribe',
    components: [
      {
        name: 'quote',
        component: SubscribeQuote,
      },
      {
        name: 'center',
        component: SubscribeCenter,
      },
      {
        name: 'block',
        component: SubscribeBlock,
      },
      {
        name: 'wide',
        component: SubscribeWide,
      },
    ],
  },
  'read-more': {
    col: 3,
    card: 'square',
    name: 'read-more',
    components: [
      {
        name: 'picture',
        component: ReadMorePicture,
      },
      {
        name: 'right',
        component: ReadMoreRight,
      },
      {
        name: 'list',
        component: ReadMoreList,
      },
    ],
  },
}
