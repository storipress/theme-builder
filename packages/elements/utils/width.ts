import type { Breakpoint } from 'shared/code-generator/style-tree'
import { isObject } from 'lodash'

export const SPACING_PATH = ['spacing']

export function normalizeWidth(width: number | string | Record<string, unknown>): Breakpoint {
  if (isObject(width)) {
    return { xs: 'auto', ...width } as Breakpoint
  }

  return {
    xs: width,
  }
}
