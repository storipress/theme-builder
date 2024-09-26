import { expect, it } from 'vitest'
import { env } from '../env'

it('should return the correct env', () => {
  expect(env.NODE_ENV).toBe('test')
})
