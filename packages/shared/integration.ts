import { noop } from 'lodash'

interface Rudder {
  page: () => void
  identify: (identity: string, properties?: Record<string, unknown>) => void
}

interface Intercom {
  (action: string, params?: Record<string, unknown>): void
}

declare global {
  interface Window {
    rudderanalytics: Rudder
    Intercom: Intercom
  }
}

export const rudder = window.rudderanalytics ?? { page: noop, identify: noop }
export const intercom: Intercom = (...args) => {
  if (window.Intercom) {
    window.Intercom(...args)
  }
}
