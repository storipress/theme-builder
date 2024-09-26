import { createEnv } from '@t3-oss/env-core'

import { envSchema } from './lib/env-schema'

export const env = createEnv({
  clientPrefix: 'VITE_',

  shared: envSchema,

  runtimeEnvStrict: {
    NODE_ENV: import.meta.env.MODE,
    BASE_URL: import.meta.env.BASE_URL,
    API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT,
    PUSHER_ENDPOINT: import.meta.env.VITE_PUSHER_ENDPOINT,
    FEATURES_ENDPOINT: import.meta.env.VITE_FEATURES_ENDPOINT,
    OPENREPLAY_PROJECT_ID: import.meta.env.VITE_OPENREPLAY_PROJECT_ID,
    SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
    ASSET_CDN: import.meta.env.VITE_ASSET_CDN,
    SEGMENT_WRITE_KEY: import.meta.env.VITE_SEGMENT_WRITE_KEY,
    PUSHER_KEY: import.meta.env.VITE_PUSHER_KEY,
    AXIOM_DATASET: import.meta.env.VITE_AXIOM_DATASET,
    AXIOM_API_TOKEN: import.meta.env.VITE_AXIOM_API_TOKEN,
  },
})

export const apiEndpoint = env.API_ENDPOINT
