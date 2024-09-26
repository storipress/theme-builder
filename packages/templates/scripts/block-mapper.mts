import type { TemplateInfo } from './utils.mts'
import { join, relative, resolve, sep } from 'node:path'
import _ from 'lodash'
import pMap from 'p-map'
import { format } from 'prettier'

import { $, fs, globby } from 'zx'
import {
  __dirname,
  extractBlockInfo,
  HEADER,
  optimizePreview,
  renderImport,
  renderInfo,
  renderMapPair,
  TYPE_DEFINE,
  TYPE_NAME,
} from './utils.mts'

const { groupBy, stubTrue } = _

const blocksPath = resolve(__dirname, '../blocks')

interface BlockInfo extends TemplateInfo {
  section: string
}

async function importedExtractPreview(block: string): Promise<string | false> {
  const previewPath = join(block, 'preview.webp')
  if (await fs.pathExists(join(blocksPath, previewPath))) {
    return previewPath
  }
  console.info(`fail to import ${block} because of missing preview image`)
  return false
}

function extractPathInfo(path: string): { section: string; name: string; templatePath: string } {
  const [section, name] = path.split(sep)
  return { section, name, templatePath: join(section, name) }
}

async function collectImportedBlock(): Promise<BlockInfo[]> {
  const paths = (await globby(join(blocksPath, '**/block/index.js'), { ignore: ['**/__*/block/index.js'] })).map(
    (path) => relative(blocksPath, path)
  )
  return pMap(paths, (path) => extractBlockInfo(path, importedExtractPreview, extractPathInfo))
}

async function collectSimpleBlock(): Promise<BlockInfo[]> {
  const paths = (await globby(join(blocksPath, '*/*.vue'))).map((path) => relative(blocksPath, path))
  return pMap(paths, (path) => extractBlockInfo(path, stubTrue, extractPathInfo))
}

async function main() {
  await optimizePreview(blocksPath)
  const info = (await Promise.all([collectImportedBlock(), collectSimpleBlock()]))
    .flat()
    .filter((x) => x != null)
    .map((info, index) => ({ ...info, index }))
  const grouped = groupBy(info, ({ section }) => section)
  const source = `
    ${HEADER}
    ${renderImport(info)}

    export * from './fallback'

${TYPE_DEFINE}

    export const maps: Record<string, Component> = {
      ${renderMapPair(info)}
    }
export const category: Record<string, ${TYPE_NAME}[]> = {
  ${renderCategory(grouped)}
}
  `
  fs.writeFile(
    join(blocksPath, 'index.ts'),
    await format(source, { parser: 'babel-ts', semi: false, singleQuote: true })
  )
  await $`yarn eslint --fix ${join(blocksPath, 'index.ts')}`
}

main()

function renderCategory(grouped: Record<string, BlockInfo[]>): string {
  return Object.keys(grouped)
    .map(
      (section) => `'${section}': [
    ${renderInfo(grouped[section])}
  ],
  `
    )
    .join('')
}
