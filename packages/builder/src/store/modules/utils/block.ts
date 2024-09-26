import type { StyleTree } from 'shared/code-generator/style-tree'
import type { FrontPage } from '../../../lib/schemas/front'
import type { BlockState } from '../types'

import { category, DEFAULT, maps } from '@storipress/templates/blocks'
import { assertStyleTree } from 'shared/code-generator/style-tree'

const HERO_BLOCKS = new Set(category.hero.map((b) => b.name))
const FOOTER_BLOCKS = new Set(category.footer.map((b) => b.name))

export function normalizeBlockData({ blocks, blockStates, images, styles, texts }: FrontPage) {
  // check there has one and only hero/footer
  blocks = blocksFilter(blocks, blockStates)

  // clean up rest of the block data
  const isInUseBlock = (blockId: string, isPrefixed = false) => {
    return blockId.startsWith('@@') || blockId === 'spacing' || blocks.includes(blockId.slice(isPrefixed ? 2 : 0))
  }

  return {
    blocks,
    blockStates: objectCleanUp(blockStates, ([key]) => isInUseBlock(key)),
    images: objectCleanUp(images, ([key]) => isInUseBlock(key, true)),
    texts: objectCleanUp(texts, ([key]) => isInUseBlock(key, true)),
    styles: assertStyleTree({
      ...styles,
      children: objectCleanUp(styles.children, ([key]) => isInUseBlock(key, true)) as Record<string, StyleTree>,
    } as StyleTree),
  }
}

function blocksFilter(blocks: string[], blockStates: Record<string, BlockState>) {
  let heroBlockIndex = -1
  let footerBlockIndex = -1

  const result = blocks.reduce((acc: string[], blockId: string, index: number) => {
    const blockType = blockStates[blockId].type

    if (!blockStates[blockId]) return acc
    if (!maps[blockType] && !blockType.includes('custom-')) return acc

    if (HERO_BLOCKS.has(blockType) && heroBlockIndex === -1) {
      heroBlockIndex = index
    } else if (FOOTER_BLOCKS.has(blockType) && footerBlockIndex === -1) {
      footerBlockIndex = index
    }
    acc.push(blockId)
    return acc
  }, [])

  const [DEFAULT_HERO, , DEFAULT_FOOTER] = DEFAULT
  if (heroBlockIndex === -1) {
    result.unshift(DEFAULT_HERO)
  } else if (heroBlockIndex > 0) {
    result.unshift(result.splice(heroBlockIndex, 1)[0])
  }

  if (footerBlockIndex === -1) {
    result.push(DEFAULT_FOOTER)
  } else if (footerBlockIndex < result.length - 1) {
    result.push(result.splice(footerBlockIndex, 1)[0])
  }
  return result
}

function objectCleanUp<T extends Record<string, unknown>>(
  object: T,
  filterRule: (elem: [string, unknown], i: number, arr: unknown[]) => boolean,
): T {
  return Object.fromEntries(Object.entries(object).filter((...args) => filterRule(...args))) as unknown as T
}
