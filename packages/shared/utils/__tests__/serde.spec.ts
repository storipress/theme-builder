import { deserialize, serialize } from '../serde'

describe('serialize', () => {
  it('handle Map and Set', () => {
    expect(serialize({ map: new Map([['a', 'b']]), set: new Set(['a', 'b']) })).toMatchSnapshot()
  })

  it('handle freezed object', () => {
    expect(serialize({ freeze: Object.freeze({ foo: 'bar' }) })).toMatchSnapshot()
  })

  it('handle freezed array', () => {
    const json = serialize({ freeze: Object.freeze([1, 2, 3]) })
    expect(json).toMatchSnapshot()
  })
})

describe('deserialize', () => {
  it('handle Map and Set', () => {
    const json = serialize({ map: new Map([['a', 'b']]), set: new Set(['a', 'b']) })
    expect(deserialize(json)).toMatchSnapshot()
  })

  it('handle freezed object', () => {
    const json = serialize({ freeze: Object.freeze({ foo: 'bar' }) })
    const value = deserialize(json)
    expect(value).toMatchSnapshot()
    expect(Object.isFrozen((value as any).freeze)).toBe(true)
  })

  it('handle freezed array', () => {
    const json = serialize({ freeze: Object.freeze([1, 2, 3]) })
    const value = deserialize(json)
    expect(Object.isFrozen((value as any).freeze)).toBe(true)
    expect((value as any).freeze).toEqual([1, 2, 3])
  })
})
