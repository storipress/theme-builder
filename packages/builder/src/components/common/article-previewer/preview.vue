<script lang="ts">
import { generate } from 'shared/code-generator'
import { createStyleTree, scopeTree } from 'shared/code-generator/style-tree'

import { ArticleProvider } from './article-provider'

export default defineComponent({
  components: { ArticleProvider },

  props: {
    name: String,

    selectable: {
      type: Boolean,
      default: true,
    },

    data: {
      type: Object,
      default: () => ({}),
    },
  },

  data: () => ({
    options: createStyleTree('article'),
  }),

  computed: {
    css(): string {
      const { name, options } = this
      return generate(scopeTree(name, options))
    },
  },

  created() {
    this.$store.commit('article/CLEAR_COLOR')
    // to get logo info
    this.$store.dispatch('front/fetchDesign')
  },
})
</script>

<template>
  <ArticleProvider v-model="options" :selectable="selectable" :data="data">
    <div class="article-display" :class="name">
      <slot />

      <component is="style" type="text/css">
        {{ css }}
      </component>
    </div>
  </ArticleProvider>
</template>

<style lang="scss" src="shared/content.scss"></style>
