<script lang="ts" setup>
import type { State as FrontState } from '../../store/modules/front'
import { sum, sumBy } from 'lodash'
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex-hooks'

import { useInsufficientArticleStore } from '../../lib/insufficient-article'
import { SnackBar } from '../common/snack-bar'

const store = useStore<{ front: FrontState }>()
const isShow = ref(true)
const insufficientArticleStore = useInsufficientArticleStore()

const deskArticles = computed(() => {
  return store.state.front.desks.map((desk) => desk.published_articles_count).filter((count) => count > 0)
})

const totalArticles = computed(() => {
  return sum(deskArticles.value)
})

const requiredAmount = ref(0)

watch(
  [() => insufficientArticleStore.articleCount, () => store.state.front.blocks],
  ([count, blocks]) => {
    requiredAmount.value = sumBy(blocks, (block) => count[block])
  },
  {
    deep: true,
  },
)

const isInsufficient = computed(() => {
  if (requiredAmount.value > totalArticles.value) {
    return true
  }
  return deskArticles.value.some((deskArticle) => {
    return requiredAmount.value > deskArticle
  })
})
</script>

<template>
  <SnackBar
    v-if="isInsufficient && isShow"
    type="warning"
    title="There are insufficient articles to fill all blocks. Blocks with insufficient articles are hidden."
    button-text="Dismiss"
    :button-icon="false"
    @click="isShow = false"
  />
</template>
