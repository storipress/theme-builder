import { safeDestr } from 'destr'
import { omit } from 'lodash'
import { z } from 'zod'

export interface LinkInfo {
  start: number
  end: number
  href?: string
  pageId?: string
}

export interface LinkState {
  content: string
  links: LinkInfo[]
}

const linkInfoSchema = z.object({
  start: z.number(),
  end: z.number(),
  href: z.string().optional(),
  pageId: z.string().optional(),
})
// old format for migration purposes
const oldLinkStateSchema = linkInfoSchema.extend({
  content: z.string(),
})

const linkStateSchema = z.object({
  content: z.string(),
  links: z.array(linkInfoSchema),
})

export function parseLinkState(value: string): LinkState {
  return parseLinkStateWithSuccess(value)[1]
}
export function parseLinkStateWithSuccess(value: string): [parseSuccess: boolean, state: LinkState] {
  try {
    const data = safeDestr(value)
    const oldFormatParsed = oldLinkStateSchema.safeParse(data)
    // migrate from old data structure
    if (oldFormatParsed.success) {
      return [
        true,
        {
          content: oldFormatParsed.data.content,
          links: [omit(oldFormatParsed.data, 'content')],
        },
      ]
    }
    return [true, linkStateSchema.parse(data)]
  } catch {
    return [
      false,
      {
        content: value,
        links: [],
      },
    ]
  }
}
