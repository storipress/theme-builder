import type { Component } from 'vue'

import FormatComment from './assets/format-comment.svg'
import FormatLinkIcon from './assets/format-link.svg'

interface BaseFormat {
  name: string
  icon?: string
  component?: Component
}

type MenuCommands =
  | 'clearNodes'
  | 'toggleBold'
  | 'toggleItalic'
  | 'toggleUnderline'
  | 'toggleBlockquote'
  | 'toggleBulletList'
  | 'toggleOrderedList'
  | 'toggleHeading'
  | 'toggleLink'
  | 'delete'
  | 'toggleComment'

export interface ActionFormat extends BaseFormat {
  action: MenuCommands
  format?: string
  options?: object
}

export interface StateFormat extends BaseFormat {
  action: MenuCommands
  state: string
  format?: string
  getOptions?: (input: string) => object
}

export interface EventFormat extends BaseFormat {
  event: string
  isActive?: (state: Record<string, any>) => boolean
}

export type ActionableFormat = ActionFormat | StateFormat
export type Format = EventFormat | ActionableFormat

export const linkFormat: StateFormat = {
  name: 'Link',
  action: 'toggleLink',
  state: 'link',
  component: FormatLinkIcon,
  getOptions: async (url: string) => {
    return {
      href: url,
    }
  },
}

const DELETE_ACTION: Format = {
  name: 'Delete',
  action: 'delete',
  icon: 'icon-delete',
}

export const FORMAT: Record<string, Format[]> = Object.freeze({
  gallery: [
    {
      name: 'Add Image',
      event: 'add-image',
      icon: 'icon-plus',
    },
    DELETE_ACTION,
  ],
  embed: [
    {
      name: 'Edit',
      event: 'edit-mode',
      icon: 'icon-pencil',
    },
    DELETE_ACTION,
  ],
  resource: [DELETE_ACTION],
  horizontal_rule: [DELETE_ACTION],
  text: [
    {
      name: 'Bold',
      action: 'toggleBold',
      format: 'bold',
      icon: 'icon-format_bold',
    },
    {
      name: 'Italic',
      action: 'toggleItalic',
      format: 'italic',
      icon: 'icon-format_italics',
    },
    {
      name: 'Underline',
      action: 'toggleUnderline',
      format: 'underline',
      icon: 'icon-format_underline',
    },
    {
      name: 'Heading 1',
      action: 'toggleHeading',
      icon: 'icon-H1',
      format: 'heading',
      options: {
        level: 1,
      },
    },
    {
      name: 'Heading 2',
      action: 'toggleHeading',
      icon: 'icon-H2',
      format: 'heading',
      options: {
        level: 2,
      },
    },
    {
      name: 'Blockquote',
      action: 'toggleBlockquote',
      icon: 'icon-quote',
      format: 'blockquote',
    },
    linkFormat,
    {
      name: 'Comment',
      action: 'toggleComment',
      component: FormatComment,
    },
  ],
})

const FULL_WIDTH = 'full-width'
export const newFormats: Record<string, Record<string, Format> | Format> = Object.freeze({
  comment: {
    name: 'Comment',
    format: 'comment',
    action: 'toggleComment',
    component: FormatComment,
  },
  link: linkFormat,
  text: {
    bold: {
      name: 'Bold',
      action: 'toggleBold',

      format: 'bold',
      icon: 'icon-format_bold',
    },
    italic: {
      name: 'Italic',
      action: 'toggleItalic',
      format: 'italic',
      icon: 'icon-format_italics',
    },
    underline: {
      name: 'Underline',
      action: 'toggleUnderline',
      format: 'underline',
      icon: 'icon-format_underline',
    },
  },
  textType: {
    text: {
      name: 'Text',
      action: 'clearNodes',
      format: 'paragraph',
      icon: 'icon-text',
    },
    h1: {
      name: 'Heading 1',
      action: 'toggleHeading',
      icon: 'icon-H1',
      format: 'heading',
      options: {
        level: 1,
      },
    },
    h2: {
      name: 'Heading 2',
      action: 'toggleHeading',
      icon: 'icon-H2',
      format: 'heading',
      options: {
        level: 2,
      },
    },
    bullet: {
      name: 'Bulleted List',
      action: 'toggleBulletList',
      format: 'bulletList',
      icon: 'icon-list_bullet',
    },
    numbered: {
      name: 'Numbered List',
      action: 'toggleOrderedList',
      format: 'orderedList',
      icon: 'icon-list_number',
    },
    quote: {
      name: 'Quote',
      action: 'toggleBlockquote',
      format: 'blockquote',
      icon: 'icon-quote',
    },
  },
  imageType: {
    justify_fit: {
      name: 'regular',
      event: 'set-regular',
      icon: 'icon-justify_fit',
      isActive: (state: Record<string, any>) => state.image === 'regular',
    },
    justify_expand: {
      name: 'wide',
      event: 'set-wide',
      icon: 'icon-justify_expand',
      isActive: (state: Record<string, any>) => state.image === 'wide',
    },
    justify_fill: {
      name: FULL_WIDTH,
      event: FULL_WIDTH,
      icon: 'icon-justify_fill',
      isActive: (state: Record<string, any>) => state.image === FULL_WIDTH,
    },
    swap: {
      name: 'Swap',
      event: 'replace-image',
      icon: 'icon-swap_photo',
    },
  },
})
