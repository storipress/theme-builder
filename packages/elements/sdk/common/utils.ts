import type { MockData } from 'data'

export const CONSOLE_PREFIX = '[@storipress/block]'

export function error(message: string, ...rest: unknown[]) {
  console.error(`${CONSOLE_PREFIX} ${message}`, ...rest)
}

export function warning(message: string) {
  console.warn(`${CONSOLE_PREFIX} ${message}`)
}

export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`${CONSOLE_PREFIX} Invariant Violation: ${message}`)
  }
}

export function getFromData<K extends keyof MockData>(data: MockData, key: K): MockData[K] {
  return data.getData?.()[key] ?? data[key]
}

export interface LinkableResource {
  name: string
  url: string
}

type RawLinkableResource = readonly string[] | readonly LinkableResource[]
type MergedLinkableResource = ReadonlyArray<string | LinkableResource>

export function normalizeLinkableResource(resources: RawLinkableResource = []): LinkableResource[] {
  return (resources as MergedLinkableResource).map((item: string | LinkableResource, id) =>
    typeof item === 'string' ? { id: `${id}`, name: item, url: '#' } : { id: `${id}`, ...item }
  )
}
