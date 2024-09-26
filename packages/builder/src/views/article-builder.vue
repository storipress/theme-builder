<script lang="ts">
import { ArticleBuilder } from '../components/article-builder'

export default defineComponent({
  components: { ArticleBuilder },

  props: {
    clientID: {
      type: String,
    },
    id: {
      type: String,
    },
  },
})
</script>

<template>
  <ArticleBuilder :id="id" />
</template>
