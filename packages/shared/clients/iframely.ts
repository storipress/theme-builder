import type { IFramely } from './iframely-types'

import ky from 'ky'

import '@iframely/embed.js'

export * from './iframely-types'

export const IFRAMELY_OPTIONS = {
  iframe: '1',
  omit_script: '1',
  html5: '1',
}

const client = ky.create({
  searchParams: IFRAMELY_OPTIONS,
})

const ENDPOINT = 'https://cdn.iframe.ly/api/iframely'

export type IframelyClient = ReturnType<typeof createIframelyClient>

interface OEmbedOptions {
  url: string
  params?: Record<string, string>
}

export function createIframelyClient(key: string) {
  return {
    oEmbed({ url, params = {} }: OEmbedOptions): Promise<IFramely> {
      return client.get(ENDPOINT, { searchParams: { ...params, key, url } }).json()
    },
  }
}
