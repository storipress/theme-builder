import type { Promisable } from 'type-fest'
import ky from 'ky'
import { formatEmbedURL } from 'spotify-uri'
import { dedent } from 'ts-dedent'

import { loadJsonp } from './jsonp'

interface RichOembedJson {
  type: 'rich'
  version: '1.0'
  provider_name: string
  provider_url: string
  html: string
  width: number | null
  height: number | null
}

export type OembedJson = RichOembedJson

interface Handler {
  test: RegExp[]
  handle: (url: string, match: RegExpExecArray) => Promisable<string>
}

const YOUTUBE_REGEX = /youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/

function injectScript(url: string) {
  const $script = document.createElement('script')
  $script.src = url
  $script.async = true
  document.head.append($script)
}

const HANDLERS: Handler[] = [
  {
    test: [/instagram\.com\/p\/\w+/],
    handle(url: string) {
      injectScript('https://www.instagram.com/embed.js')
      return dedent`
        <blockquote
          class="instagram-media"
          data-instgrm-captioned
          data-instgrm-permalink="${url}"
        ></blockquote>
      `
    },
  },
  {
    test: [/twitter\.com\/[^/]+\/status\/[^/]+/],
    async handle(url: string): Promise<string> {
      injectScript('https://platform.twitter.com/widgets.js')
      return dedent`
        <blockquote class="twitter-tweet">
          <a href="${url}"></a>
        </blockquote>
      `
    },
  },

  {
    test: [YOUTUBE_REGEX],
    handle(_url: string, match: RegExpExecArray): string {
      const id = match[1]
      return `<lite-youtube class="w-full h-full" videoid="${id}"></lite-youtube>`
    },
  },
  {
    test: [
      /soundcloud\.com|snd\.sc\/(.*)/i,
      /.+\.soundcloud\.com\/player\/\?url=(https?%3a\/\/.+\.soundcloud\.com\/tracks\/.+?)&/i,
    ],
    async handle(url: string): Promise<string> {
      const res = await ky
        .get('https://soundcloud.com/oembed', { searchParams: { url, format: 'json' } })
        .json<RichOembedJson>()
      return res.html
    },
  },
  {
    test: [
      /https?:\/\/(?:www\.)?vimeo\.com\/\w*\/*(([a-z]{0,2}-)?\d+)/i,
      /https?:\/\/(?:player\.)?vimeo\.com\/\w*\/*(([a-z]{0,2}-)?\d+)/i,
    ],
    async handle(url: string): Promise<string> {
      const res = await ky.get('https://vimeo.com/api/oembed.json', { searchParams: { url } }).json<RichOembedJson>()
      return res.html
    },
  },
  {
    test: [
      /https?:\/\/open\.spotify\.com\/(.*)\/(.*)/i,
      /https?:\/\/play\.spotify\.com\/(.*)\/(.*)/i,
      /https?:\/\/embed\.spotify\.com\/\?uri=spotify:(.*):(.*)/i,
      /https?:\/\/embed\.spotify\.com\/\?uri=spotify%3a(.*)%3a(.*)/i,
    ],
    handle(url: string): string {
      const embedURL = formatEmbedURL(url)
      return dedent`
        <iframe
          src="${embedURL}"
          width="100%"
          height="380"
          frameborder="0"
          allowtransparency="true"
          allow="encrypted-media"
        ></iframe>
      `
    },
  },
  {
    test: [/codepen\.io\/[^/]+\/pen\/[^/]+/],
    async handle(url: string): Promise<string> {
      const res = await loadJsonp<RichOembedJson>({
        url: 'http://codepen.io/api/oembed/',
        params: { url, format: 'js' },
      })
      return res.html
    },
  },
]

export async function embedify(url: string): Promise<string> {
  for (const handler of HANDLERS) {
    for (const regex of handler.test) {
      const match = regex.exec(url)
      if (match) {
        return handler.handle(url, match)
      }
    }
  }
  throw new Error('unable to handle')
}
