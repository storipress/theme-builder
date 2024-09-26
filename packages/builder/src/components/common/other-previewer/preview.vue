<script lang="ts">
import { generate } from 'shared/code-generator'
import { createStyleTree, scopeTree } from 'shared/code-generator/style-tree'

import { OtherProvider } from './other-provider'

export default defineComponent({
  components: { OtherProvider },

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
})
</script>

<template>
  <OtherProvider v-model="options" :selectable="selectable" :data="data">
    <div class="article-display tippy-none" :class="name">
      <slot />

      <component is="style" type="text/css">
        {{ css }}
      </component>
    </div>
  </OtherProvider>
</template>

<style lang="scss" src="shared/content.scss"></style>

<style lang="scss">
.article-display {
  .tiptap-menu .format.format-comment {
    display: none;
  }
}
</style>
