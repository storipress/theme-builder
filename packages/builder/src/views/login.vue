<script lang="ts" setup>
import { useStorage } from '@vueuse/core'
import { useMutations } from 'vuex-hooks'

import { useRouter } from '../lib/hooks'

const props = defineProps({
  path: {
    type: String,
  },
  token: {
    type: String,
  },
})

const tokenStore = useStorage('storipress-token', '')

onMounted(() => {
  if (props.token) {
    const router = useRouter()
    const mutations = useMutations('auth')
    mutations.SET_TOKEN(props.token)
    tokenStore.value = props.token
    router.replace(props.path ?? '/workspaces')
  } else {
    const host = location.origin

    location.href = `${host}/settings/auth/redirect?redirect=${location.href}`
  }
})
</script>

<template>
  <p>redirecting</p>
</template>
