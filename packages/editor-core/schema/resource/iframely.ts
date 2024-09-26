import { iframely } from '@iframely/embed.js'

iframely.extendOptions({ key: import.meta.env.VUE_APP_IFRAMELY_KEY })

/**
 * explicit load iframely iframe
 */
export function load() {
  iframely.load()
}
