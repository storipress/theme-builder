import { defineComponent, h } from 'vue-demi'

import LinkElement from '../../common/link-element.vue'
import { compositionStyleProps } from '../../utils/style-props'
import { useArticleElement } from '../inject'
import AuthorName from './author-name.vue'

export const Authors = defineComponent({
  props: {
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
    ...compositionStyleProps,
  },

  setup(props, { slots }) {
    const { authorClass, separator, separatorClass, ...rest } = props
    const $element = useArticleElement()
    const { authors } = $element.value
    const textProps = {
      ...rest,
    }

    function createSeparator(author: object, i: number) {
      const slot = slots.separator?.({ author, index: i, total: authors.length })
      if (i === authors.length - 1) {
        return slot ?? h(AuthorName, { key: `${i}-sep`, class: separatorClass }, [' and '])
      }

      if (i !== 0) {
        return slot ?? h(AuthorName, { key: `${i}-sep` }, [separator])
      }

      return h()
    }

    return () => {
      const authorNodes =
        authors.length === 1
          ? [
              h(LinkElement, { class: authorClass, props: { href: authors[0].url } }, [
                slots.name?.({ author: authors[0], index: 0 }) ??
                  h(AuthorName, { props: textProps }, [authors[0].name]),
              ]),
            ]
          : authors.flatMap((author, i) => [
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
                [slots.name?.({ author, index: i }) ?? h(AuthorName, { props: textProps }, [author.name])]
              ),
            ])

      return h('span', authorNodes)
    }
  },
})
