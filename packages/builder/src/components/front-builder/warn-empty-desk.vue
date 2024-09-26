<script lang="ts" setup>
import type { State as FrontState } from '../../store/modules/front'
import { computed, ref } from 'vue'
import { useStore } from 'vuex-hooks'

import { SnackBar } from '../common/snack-bar'

const store = useStore<{ front: FrontState }>()
const isShow = ref(true)

const emptyDesks = computed(() => {
  return store.state.front.desks
    .filter((desk) => desk.published_articles_count === 0)
    .map((desk) => `"${desk.name}"`)
    .sort()
})

const hasEmptyDesk = computed(() => {
  return emptyDesks.value.length > 0
})
</script>

<template>
  <SnackBar
    v-if="hasEmptyDesk && isShow"
    type="warning"
    :title="`Desk(s) ${emptyDesks.join(', ')} will be hidden as they are empty.`"
    button-text="Dismiss"
    :button-icon="false"
    @click="isShow = false"
  />
</template>
