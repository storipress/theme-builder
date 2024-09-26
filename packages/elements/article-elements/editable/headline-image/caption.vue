<script lang="ts">
import type { Props } from '../../../utils/style-props'
import { RichInput } from '@storipress/editor-core'
import { debounce } from 'lodash'

import { computed, defineComponent } from 'vue-demi'
import { styleProps } from '../../../utils/style-props'
import { useArticleElement } from '../../inject'
import ArticleElement from '../article-element.vue'

interface CaptionProps extends Props {
  component: string
}

export default defineComponent<CaptionProps>({
  components: { RichInput, ArticleElement },

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
      headlineCaption: computed({
        get() {
          return element.value.headlineCaption
        },
        set: debounce((val: string) => {
          element.value.headlineCaption = val
        }, 300),
      }),
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
  <ArticleElement :component="component" kind="headline-caption" :styles="styles">
    <RichInput v-model="headlineCaption" class="headline-caption" />
  </ArticleElement>
</template>
