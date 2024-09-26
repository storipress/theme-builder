import type { RouteConfig } from 'vue-router'
import Vue from 'vue'
import { defineAsyncComponent } from 'vue-demi'
import VueRouter from 'vue-router'

import { analytics } from '../analytics'
import { useUnsavedStore } from '../components/common/top-toolbar/settings/unsaved-change/composables'
import { env } from '../env'
import { clientID } from '../global-bus'
import { updateAttributes } from '../lib/feature-flag'
import { SET_ROUTE, store } from '../store'
import NotFound from '../views/404.vue'
import Login from '../views/login.vue'

Vue.use(VueRouter)

const isIFrame = window.self !== window.top

const routes: RouteConfig[] = [
  {
    name: 'workspaces',
    path: '/workspaces',
    component: defineAsyncComponent(() => import('../views/workspaces.vue')),
  },
  {
    name: 'login',
    path: '/login',
    component: Login,
    props: ({ query }) => ({ path: query.path, token: query.token }),
  },
  {
    name: 'article',
    path: '/:clientID/article/:id',
    component: defineAsyncComponent(() => import('../views/article-builder.vue')),
    props: true,
  },
  {
    name: 'other',
    path: '/:clientID/other/:oid',
    component: defineAsyncComponent(() => import('../views/other-page.vue')),
    props: true,
  },
  {
    name: 'front-page',
    path: '/:clientID/front-page',
    component: defineAsyncComponent(() => import('../views/front-builder.vue')),
    props: true,
  },
  {
    name: 'article-preview',
    path: '/:clientID/article-preview',
    component: defineAsyncComponent(() => import('../views/article-preview.vue')),
  },
  {
    name: 'front-preview',
    path: '/:clientID/front-preview',
    component: defineAsyncComponent(() => import('../views/front-preview.vue')),
    props: true,
  },
  {
    name: 'other-preview',
    path: '/:clientID/other-preview/',
    component: defineAsyncComponent(() => import('../views/other-preview.vue')),
  },
  {
    name: 'internal',
    path: '/:clientID/internal',
    component: defineAsyncComponent(() => import('../views/internal.vue')),
  },
  {
    name: '404',
    path: '/404',
    component: NotFound,
  },
  {
    path: '/:clientID/*',
    redirect: { name: 'front-page' },
  },
  {
    name: 'root',
    path: '/',
    redirect: { name: 'workspaces' },
  },
  {
    name: 'catchall',
    path: '/*',
    redirect: { name: '404' },
  },
]

export const router = new VueRouter({
  mode: 'history',
  base: env.BASE_URL,
  routes,
})

router.beforeEach(async (to, from, next) => {
  const unsavedStore = useUnsavedStore()
  if (from.name && from.params.clientID && !unsavedStore.skipSaveCheck) {
    await store.dispatch('updateCurrentPage')
  }
  unsavedStore.skipSaveCheck = false

  if (!isIFrame) {
    const { matched, ...data } = to
    store.commit(SET_ROUTE, data)
    store.dispatch('resetPageState')
  }

  next()
})

router.afterEach((to) => {
  clientID.post(to.params.clientID || null)
  analytics.page()
  updateAttributes({
    url: to.path,
  })
})
