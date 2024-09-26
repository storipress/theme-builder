import type { DeferredPromise } from 'p-defer'
import pDefer from 'p-defer'

import * as blocks from '../../../elements/block-elements'

interface Module {
  exports: any
}

export interface BlockInfo {
  name: string
  version: string
  factory: (module: Module, exports: any, require: (request: string) => any) => any
}

export interface BlockMeta {
  name: string
  id: string
  lastModifyTime: number
}

declare global {
  interface Window {
    __STORIPRESS_BLOCK_HOOK__: (blockInfo: BlockInfo) => void
  }
}

interface BlockCacheItem {
  name: string
  version: string
  component?: any
  script?: HTMLElement
  info: BlockInfo
}

const CACHE = new Map<string, BlockCacheItem>()
const LOADER_CACHE = new Map<string, DeferredPromise<BlockCacheItem> & { script: HTMLElement }>()

export function loadBlock(meta: BlockMeta, clientID: string): Promise<BlockCacheItem> {
  const cacheItem = CACHE.get(meta.name)
  if (cacheItem) {
    return Promise.resolve(cacheItem)
  }

  if (LOADER_CACHE.has(meta.name)) {
    return LOADER_CACHE.get(meta.name)!.promise
  }

  return new Promise((resolve, reject) => {
    const deferred = pDefer<BlockCacheItem>()
    const script = document.createElement('script')
    LOADER_CACHE.set(meta.name, { ...deferred, script })
    script.src = `https://assets.stori.press/${clientID}/blocks/${meta.id}/bundled/index.js?u=${meta.lastModifyTime}`

    deferred.promise.then(resolve).catch(reject)

    script.addEventListener('error', (e) => {
      reject(e)
    })
    document.head.append(script)
  })
}

export async function getBlock(meta: BlockMeta, clientID: string): Promise<any> {
  const cacheItem = CACHE.get(meta.name)

  if (cacheItem && cacheItem.component) {
    return Promise.resolve(cacheItem.component)
  }

  const block = await loadBlock(meta, clientID)
  const module: Module = { exports: {} }

  block.info.factory(module, module.exports, requireStub)

  const resolvedItem = {
    ...block,
    component: module.exports.default ?? module.exports,
  }

  CACHE.set(meta.name, resolvedItem)
  return resolvedItem.component
}

export function clearCache() {
  for (const item of CACHE.values()) {
    item.script?.remove()
  }
  CACHE.clear()
  LOADER_CACHE.clear()
}

window.__STORIPRESS_BLOCK_HOOK__ = (blockInfo) => {
  const cacheItem = CACHE.get(blockInfo.name)
  if (cacheItem) {
    cacheItem.info = blockInfo
  } else {
    const loaderCache = LOADER_CACHE.get(blockInfo.name)
    const script = loaderCache?.script

    CACHE.set(blockInfo.name, {
      name: blockInfo.name,
      version: blockInfo.version,
      info: blockInfo,
      component: undefined,
      script,
    })

    if (loaderCache) {
      loaderCache.resolve(CACHE.get(blockInfo.name))
    }
  }
  LOADER_CACHE.delete(blockInfo.name)
}

function requireStub(request: string): any {
  if (request === '@storipress/block') return blocks

  throw new Error(`module ${request} not found`)
}
