import delay from 'delay'

export const isMac = typeof window !== 'undefined' && /Mac/.test(window.navigator.platform)

export function nextTick(): Promise<void> {
  return delay(0)
}
