<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue-demi'

import { BlocksPreview } from '../components/front-preview'
import { canLoadMore, getArticlesMap, hasEmptyArticle, setSource } from '../lib/data-source'

export default defineComponent({
  components: { BlocksPreview },

  props: {
    clientID: String,
  },

  setup(props) {
    const isReady = ref(false)
    let page = 1
    watch(
      [isReady, canLoadMore, hasEmptyArticle],
      async () => {
        if (!isReady.value) {
          return
        }

        await nextTick()

        if (!canLoadMore.value) {
          return
        }

        if (!hasEmptyArticle.value) {
          return
        }

        page += 1
        setSource(await getArticlesMap(props.clientID as string, page))
      },
      { flush: 'post' },
    )

    async function created() {
      setSource(await getArticlesMap(props.clientID as string, page))
      isReady.value = true
    }

    created()

    onMounted(() => {
      document.body.className = 'bg-white'
    })

    return {
      isReady,
    }
  },
})
</script>

<template>
  <BlocksPreview v-if="isReady" />
</template>
