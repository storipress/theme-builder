<script lang="ts">
import type { State } from './store'
import type { State as AuthState } from './store/modules/auth'
import { captureException } from '@sentry/vue'
import { PortalTarget } from 'portal-vue'
import { isSafari } from 'shared/utils'

import { defineComponent, nextTick, onBeforeMount, onMounted, watch } from 'vue-demi'
import { useState, useStore } from 'vuex-hooks'
import { getSiteCustomSite } from './api'
import { MenuTarget, SearchTarget } from './components/common/block-previewer'
import Layout from './components/layout.vue'
import NoSafari from './components/no-safari.vue'
import { env } from './env'
import { clientID, token as tokenEvt } from './global-bus'
import { setupIntegrations } from './integrations'
import { Flags, updateAttributes, useFeatureFlag, useGrowthBookInit } from './lib/feature-flag'
import { getWebFonts } from './lib/get-web-fonts'
import { useRoute, useRouter } from './lib/hooks'
import { persisted } from './persistent'
import { SET_CLIENT_ID } from './store'

const isDev = env.NODE_ENV !== 'production'
const isIFrame = window.self !== window.top

function setBodyClass() {
  const bodyClasses = ['bg-white', 'overflow-hidden']
  if (isIFrame) bodyClasses.push('w-screen', 'h-screen', 'overflow-y-auto', 'is-iframe')

  document.body.className = bodyClasses.join(' ')
}

export default defineComponent({
  name: 'App',

  components: { Layout, PortalTarget, MenuTarget, SearchTarget, NoSafari },

  // eslint-disable-next-line sonarjs/cognitive-complexity
  setup() {
    const store = useStore<State>()
    const state = useState<AuthState>('auth')
    const router = useRouter()
    const route = useRoute()

    clientID.post(route.value.params.clientID || store.state.clientID)

    useGrowthBookInit()

    const checkToken = async () => {
      const token = state.token.value

      if (isDev && route.value.name === 'internal') {
        return
      }

      if (!token && route.value.name !== 'login') {
        router.replace({ name: 'login', query: { path: route.value.fullPath } })
      } else if (token) {
        await store.dispatch('fetchProfile')
      }
    }

    persisted(store)
    if (state.token.value) {
      tokenEvt.post(state.token.value)
    }

    watch(state.token, () => {
      checkToken()
    })

    watch(
      () => store.state.profile,
      (profile) => {
        if (profile) {
          setupIntegrations(profile)
        }
      },
      {
        immediate: true,
      },
    )

    async function checkPermission() {
      if (!store.state.profile?.role) {
        await store.dispatch('fetchProfile')
      }

      const profile = store.state.profile
      if (profile && profile.role && profile.role !== 'owner' && profile.role !== 'admin') {
        const { clientID } = route.value.params
        location.href = clientID ? `/home/${clientID}` : `/home`
      }
    }

    watch(
      route,
      async (newRoute) => {
        const { clientID } = newRoute.params
        if (clientID && clientID !== store.state.clientID) {
          store.commit(SET_CLIENT_ID, clientID)
          updateAttributes({ clientID })
          if (state.token.value) {
            store.dispatch('fetchIntegrations')
          }
          await store.dispatch('fetchProfile')
        }
        if (clientID) {
          checkPermission()
        }
      },
      { immediate: true },
    )

    onBeforeMount(() => {
      getWebFonts()
      nextTick(setBodyClass)
      checkToken()
    })

    onMounted(() => {
      if (store.state.profile) {
        setupIntegrations(store.state.profile)
      }
    })
    const enableCustomSite = useFeatureFlag(Flags.CustomSite)
    watch([enableCustomSite, state.token, () => route.value.params.clientID], async ([enabled, token, clientID]) => {
      if (isDev && route.value.name === 'internal') {
        return
      }
      if (!enabled || !token || !clientID) return
      try {
        const useCustomSite = await getSiteCustomSite()
        if (!useCustomSite) return
        const { clientID } = route.value.params
        window.location.replace(`/${clientID}/`)
      } catch (error) {
        captureException(error)
      }
    })

    return {
      appClass: !isIFrame && 'bg-white-grey',
      isSafari,
      isIFrame,
    }
  },
})
</script>

<template>
  <div id="app" class="relative" :class="appClass">
    <Layout v-if="$route.name">
      <router-view />
    </Layout>
    <PortalTarget name="dialog" />
    <MenuTarget />
    <SearchTarget />
    <PortalTarget name="saveWarning" />
    <NoSafari v-if="isSafari" />
  </div>
</template>

<style lang="scss" src="./style.scss"></style>
