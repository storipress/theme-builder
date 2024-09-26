import { expect, it } from 'vitest'

import { deserialize, serialize } from '../serde'

it('handle freezed object', () => {
  const serialized = serialize(Object.freeze({ a: { b: 1 } }))
  expect(serialized).toMatchSnapshot()
  const obj: { a: { b: number } } = deserialize(serialized)
  expect(obj).toEqual({ a: { b: 1 } })
  expect(Object.isFrozen(obj)).toBe(true)
  expect(Object.isFrozen(obj.a)).toBe(false)
})

it('handle freezed array', () => {
  const serialized = serialize(Object.freeze([[1], [2]]))
  expect(serialized).toMatchSnapshot()
  const obj: number[][] = deserialize(serialized)
  expect(obj).toEqual([[1], [2]])
  expect(Object.isFrozen(obj)).toBe(true)
  expect(Object.isFrozen(obj[0])).toBe(false)
})

it('handle Map', () => {
  const serialized = serialize(new Map([['a', 1]]))
  const obj: Map<string, number> = deserialize(serialized)
  expect(obj).toEqual(new Map([['a', 1]]))
})

it('handle Set', () => {
  const serialized = serialize(new Set([1, 2]))
  const obj: Set<number> = deserialize(serialized)
  expect(obj).toEqual(new Set([1, 2]))
})
