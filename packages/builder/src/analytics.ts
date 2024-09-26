import { AnalyticsBrowser } from '@segment/analytics-next'

import { env } from './env'

export const analytics = new AnalyticsBrowser()

if (env.SEGMENT_WRITE_KEY) {
  analytics.load({
    writeKey: env.SEGMENT_WRITE_KEY,
  })
}
