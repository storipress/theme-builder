<script lang="ts">
import { AutoSizeInput } from '@storipress/elements/common'
import { defineComponent } from 'vue-demi'

import { compositionStyleProps } from '../../utils/style-props'
import ArticleElement from './article-element.vue'
import { useInput } from './use-input'

export default defineComponent({
  components: { AutoSizeInput, ArticleElement },

  props: {
    kind: { type: String, default: 'article-title' },
    ...compositionStyleProps,
  },

  setup(props) {
    return useInput(props, 'title', 'blurb')
  },
})
</script>

<template>
  <ArticleElement component="h1" :kind="kind" :path="path" :class="[kind, variant]" :styles="styles">
    <AutoSizeInput
      ref="input"
      v-model="innerInput"
      :class="$style.input"
      :input-class="inputClass"
      type="textarea"
      placeholder="Add Title"
      @focus="sync = false"
      @blur="sync = true"
      @input="debounceUpdate"
      @keydown.enter.prevent="handleEnter"
    />
  </ArticleElement>
</template>

<style lang="scss" module>
.input {
  @apply transition-shadow;

  :global(.active-light) & {
    @apply hover:shadow-2 focus-within:shadow-2;
  }

  :global(.active-dark) & {
    @apply hover:shadow-w2 focus-within:shadow-w2;
  }
}
</style>
