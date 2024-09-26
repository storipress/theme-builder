import type { StyleTree } from 'shared/code-generator/style-tree'
import { assertStyleTree } from 'shared/code-generator/style-tree'
import { expect, it } from 'vitest'

import { FrontPageSchema } from '../front'
import frontData from './__fixtures__/front.json'

it('schema parse correctly', () => {
  const normalizedData = { ...frontData, styles: assertStyleTree(frontData.styles as unknown as StyleTree) }
  expect(() => {
    FrontPageSchema.parse(normalizedData)
  }).not.toThrow()
  expect(normalizedData).toMatchSnapshot()
})
