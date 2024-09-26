import { describe, expect, it } from 'vitest'
import * as siteVariant from '../block-elements'
import * as sdkVariant from '../sdk/block-elements'

function isComponentLike(name: string): boolean {
  return name[0].toUpperCase() === name[0] && name[1].toUpperCase() !== name[1]
}

describe('block elements', () => {
  it('should have the same properties as the site variant', () => {
    const keys = Object.keys(siteVariant).filter((key) => isComponentLike(key))
    for (const key of keys) {
      expect(sdkVariant).toHaveProperty(key)
    }
    expect(keys).toMatchSnapshot()
  })
})
