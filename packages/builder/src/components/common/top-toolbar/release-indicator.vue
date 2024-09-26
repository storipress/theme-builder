<script lang="ts">
import { noop } from 'lodash'
import { computed, defineComponent, ref, watch, watchEffect } from 'vue-demi'
import { useStore } from 'vuex-hooks'

import useEcho from '../../../composables/useEcho'

const DEFAULT_STATUS = 'deployed'
const STATUS_MAP = {
  building: {
    class: 'bg-clear-blue',
    message: 'Building...',
  },
  deployed: {
    class: 'bg-grassy-green',
    message: 'All Changes Live',
  },
  changed: {
    class: 'bg-mango',
    message: 'Changes Not Live',
  },
}

export default defineComponent({
  setup() {
    const { state, getters, dispatch, commit } = useStore()

    watch(
      () => state.auth.token,
      (token) => {
        // we haven't login, don't subscribe
        if (!token) {
          return
        }

        const { onNotification, EchoEvent } = useEcho()
        onNotification(async ({ type, data }) => {
          const releaseId = String(data?.release_id)

          const isDone = type === EchoEvent.site.deployment.succeeded
          const isFail = type === EchoEvent.site.deployment.failed
          if (isDone) {
            await dispatch('fetchReleases').catch(noop)
            commit('SET_IS_DEPLOYING', false)
          } else if (isFail) {
            await dispatch('fetchReleases').catch(noop)
            if (state.releases?.[0].id !== releaseId) return

            commit('SET_IS_DEPLOYING', false)
            commit('SET_SAVING_STATUS', 'edited')
          } else {
            commit('SET_IS_DEPLOYING', true)
          }
        })
      },
      { immediate: true },
    )

    const isDeploying = computed(() => state.isDeploying)

    const editedFlag = ref(false)

    let timer: ReturnType<typeof setInterval>
    const routeName = computed(() => state.route.name)
    const otherPageMode = computed(() => state.other.mode)
    watchEffect(() => {
      if (routeName.value === 'other' && otherPageMode.value === 'edit') {
        editedFlag.value = true
        commit('SET_SAVING_STATUS', 'edited')
        if (!timer) {
          timer = setInterval(() => {
            editedFlag.value = true
            commit('SET_SAVING_STATUS', 'edited')
          }, 10 * 1000)
        }
      } else {
        clearInterval(timer)
        editedFlag.value = false
        commit('SET_SAVING_STATUS', 'done')
      }
    })
    watch(
      () => state.savingStatus,
      (val) => {
        if (val === 'done') editedFlag.value = false
      },
    )

    const status = ref(DEFAULT_STATUS)
    const indicatorClass = ref(STATUS_MAP[DEFAULT_STATUS].class)
    const message = ref(STATUS_MAP[DEFAULT_STATUS].message)

    watchEffect(() => {
      const isCurrentVersion = !editedFlag.value && getters.isCurrentVersion
      const uiStatus = isDeploying.value ? 'building' : isCurrentVersion ? 'deployed' : 'changed'
      const uiStatusData = STATUS_MAP[uiStatus]

      status.value = uiStatus
      indicatorClass.value = uiStatusData.class
      message.value = uiStatusData.message
    })

    return { indicatorClass, message, status }
  },
})
</script>

<template>
  <div
    class="transition-color mt-1 flex w-fit items-center gap-1 rounded-sm px-1"
    :class="status === 'building' ? 'shadow-1 bg-white' : 'bg-black bg-opacity-5'"
  >
    <div class="relative flex h-[0.375rem] w-[0.375rem]">
      <span class="absolute h-full w-full animate-ping rounded-full opacity-50" :class="indicatorClass" />
      <span class="inline-flex h-[0.375rem] w-[0.375rem] rounded-full" :class="indicatorClass" />
    </div>
    <span class="text-almost-black text-xs uppercase opacity-[35%]">{{ message }}</span>
  </div>
</template>
