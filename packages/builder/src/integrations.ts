import type { Profile } from './api'
import Tracker from '@openreplay/tracker'
import trackerAssist from '@openreplay/tracker-assist'

import * as Sentry from '@sentry/vue'
import { analytics } from './analytics'
import { env } from './env'
import { updateAttributes } from './lib/feature-flag'

declare global {
  interface Window {
    SENTRY_RELEASE?: { id: string }
  }
}

const isMain = window.top === window.self

let tracker: Tracker

if (env.OPENREPLAY_PROJECT_ID && isMain) {
  tracker = new Tracker({
    projectKey: env.OPENREPLAY_PROJECT_ID,
    captureIFrames: true,
    revID: window.SENTRY_RELEASE?.id,
  })
  tracker.use(
    trackerAssist({
      confirmText: 'Storipress Support',
    }),
  )
  tracker.start()
}

export function setupIntegrations(profile: Profile) {
  tracker?.setUserID(profile.email)
  updateAttributes({
    id: profile.id,
    loggedIn: true,
    role: profile.role || 'contributor',
  })
  analytics.identify(profile.id, { name: profile.name, email: profile.email })
  Sentry.setUser({
    id: profile.id,
    email: profile.email ?? undefined,
  })
}
