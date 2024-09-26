import { describe, expect, it, vi } from 'vitest'
import * as siteVariant from '../article-elements'
import * as sdkVariant from '../sdk/article-elements'

vi.mock('@storipress/editor-core', () => ({
  Tiptap: { render: (h: any) => h() },
  RichInput: { render: (h: any) => h() },
}))

function isComponentLike(name: string): boolean {
  return name[0].toUpperCase() === name[0]
}

describe('article elements', () => {
  it('should have the same properties as the site variant', () => {
    const keys = Object.keys(siteVariant).filter((key) => isComponentLike(key))
    for (const key of keys) {
      expect(sdkVariant).toHaveProperty(key)
    }
    expect(keys).toMatchSnapshot()
  })
})
