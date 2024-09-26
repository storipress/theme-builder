import { expect, it } from 'vitest'

import defaultFront from '../default-front.json'
import { normalizeBlockData } from '../utils/block'

it('default front should be in normalized state', () => {
  expect(normalizeBlockData(defaultFront)).toEqual(defaultFront)
})
