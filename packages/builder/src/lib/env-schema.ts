import { z } from 'zod'

export const envSchema = {
  BASE_URL: z.string(),
  API_ENDPOINT: z.string().url(),
  PUSHER_ENDPOINT: z.string(),
  PUSHER_KEY: z.string(),
  FEATURES_ENDPOINT: z.string(),
  OPENREPLAY_PROJECT_ID: z.string(),
  SENTRY_DSN: z.string(),
  ASSET_CDN: z.string().url(),
  NODE_ENV: z.string(),
  SEGMENT_WRITE_KEY: z.string().optional(),
  AXIOM_DATASET: z.string(),
  AXIOM_API_TOKEN: z.string(),
}
