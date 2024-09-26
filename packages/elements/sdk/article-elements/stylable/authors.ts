import type { VNode } from 'vue'
import Vue from 'vue'

import LinkElement from '../../../common/link-element.vue'
import { styleProps } from '../../../utils/style-props'
import AuthorName from './author-name.vue'
import { createProvider } from './provider'

export const Authors = Vue.extend({
  functional: true,

  props: {
    component: {
      type: String,
      default: 'p',
    },
    authorComponent: {
      type: String,
      default: 'span',
    },
    separator: {
      type: String,
      default: ', ',
    },
    authorClass: {
      type: String,
    },
    separatorClass: {
      type: String,
    },
    ...styleProps,
  },

  render(h, { props, slots }) {
    const { component, authorComponent, authorClass, separator, separatorClass, ...rest } = props
    const $element = createProvider()
    const { authors } = $element
    const $slots = slots()
    const textProps = {
      component: authorComponent,
      ...rest,
    }

    function createSeparator(author: object, i: number) {
      const slot = $slots.separator?.({ author, index: i, total: authors.length })
      if (i === authors.length - 1) {
        return slot ?? h(AuthorName, { key: `${i}-sep`, class: separatorClass }, [' and '])
      }

      if (i !== 0) {
        return slot ?? h(AuthorName, { key: `${i}-sep` }, [separator])
      }

      return h()
    }

    if (authors.length === 1) {
      return h(LinkElement, { class: authorClass, props: { href: authors[0].url } }, [
        $slots.name?.({ author: authors[0], index: 0 }) ?? h(AuthorName, { props: textProps }, [authors[0].name]),
      ])
    }

    return authors.flatMap((author, i) => [
      createSeparator(author, i),
      h(
        LinkElement,
        {
          key: `${i}`,
          class: authorClass,
          props: {
            href: author.url,
          },
        },
        [$slots.name?.({ author, index: i }) ?? h(AuthorName, { props: textProps }, [author.name])]
      ),
    ]) as unknown as VNode
  },
})
