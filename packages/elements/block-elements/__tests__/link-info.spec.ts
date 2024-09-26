import { expect, it } from 'vitest'
import { parseLinkState } from '../link-info'

it.each([
  ['foo', { content: 'foo', links: [] }],
  [
    JSON.stringify({ content: 'foo', start: 0, end: 0, href: 'https://example.com' }),
    { content: 'foo', links: [{ start: 0, end: 0, href: 'https://example.com' }] },
  ],
  [
    JSON.stringify({ content: 'foo', start: 0, end: 0, pageId: '1' }),
    { content: 'foo', links: [{ start: 0, end: 0, pageId: '1' }] },
  ],
  [
    JSON.stringify({ content: 'foo', links: [{ start: 0, end: 0, pageId: '1' }] }),
    { content: 'foo', links: [{ start: 0, end: 0, pageId: '1' }] },
  ],
])('parseLinkState should work', (data, expected) => {
  expect(parseLinkState(data)).toEqual(expected)
})
