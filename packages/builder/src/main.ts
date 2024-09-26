import * as Sentry from '@sentry/vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { createPinia } from 'pinia'
import { imageFadeIn } from 'shared/directives/image-fade-in'
import { createApp, h, provide } from 'vue-demi'
import InstantSearch from 'vue-instantsearch'
import { client } from './api'
import App from './app.vue'

import { env } from './env'
import { sync } from './lib/pinia-sync'
import { storipress } from './plugins/storipress'
import { router } from './router'
import { store } from './store'
import 'tippy.js/dist/tippy.css'

import '@storipress/vue-slider-component/dist/vue-slider-component.css'
import '@storipress/vue-slider-component/theme/default.css'
import 'shared/tailwind.css'
import 'keen-slider/keen-slider.css'
import 'codemirror/lib/codemirror.css'
import './bootstrap'
import './track'

const app = createApp({
  store,
  router,
  setup() {
    provide(DefaultApolloClient, client)
  },
  render: () => h(App),
})
app.config.productionTip = false
app.config.performance = true

Sentry.init({
  app,
  dsn: env.SENTRY_DSN,
  tunnel: 'https://report-uri.stori.press/sentry',
  integrations: [
    Sentry.browserTracingIntegration({
      router,
      tracingOrigins: ['localhost', 'stori.press', 'storipress.dev', /^\//],
    }),
  ],
  logErrors: true,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1,
})

const pinia = createPinia()
pinia.use(sync)

app.use(pinia as any)
app.use(storipress, { store })
app.use(InstantSearch)
app.directive('imageFadeIn', imageFadeIn)
app.mount('#app')
