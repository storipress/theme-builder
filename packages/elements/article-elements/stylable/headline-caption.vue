<script lang="ts">
import type { Props } from '../../utils/style-props'

import { computed, defineComponent } from 'vue-demi'
import { styleProps } from '../../utils/style-props'
import { useArticleElement } from '../inject'
import ArticleElement from './article-element.vue'

interface CaptionProps extends Props {
  component: string
}

export default defineComponent<CaptionProps>({
  components: { ArticleElement },

  // @ts-expect-error no idea why overload not found
  props: {
    component: {
      type: String,
      default: 'figcaption',
    },
    ...styleProps,
  },

  setup(props: Readonly<CaptionProps>) {
    const element = useArticleElement()

    return {
      element,

      styles: computed(() => {
        const { component, ...styles } = props
        return styles
      }),
    }
  },
})
</script>
'

<template>
  <ArticleElement
    :component="component"
    kind="headline-caption"
    class="headline-caption"
    :styles="styles"
    v-html="element.headlineCaption"
  />
</template>
