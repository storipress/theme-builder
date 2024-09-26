import { initial, last } from 'lodash'
import invariant from 'tiny-invariant'

export function ensurePath(path: readonly string[], draft: Record<string, any>): [string, Record<string, any>] {
  const init = initial(path)
  const l = last(path)

  invariant(l, 'must have at least one key for path')

  return [
    l,
    init.reduce(
      (obj: Record<string, any>, key) => {
        if (typeof obj[key] !== 'object' || !obj[key]) {
          obj[key] = {}
        }
        return obj[key]
      },
      draft as Record<string, any>,
    ),
  ]
}
