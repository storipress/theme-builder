import type { TemplateInfo } from './utils.mts'
import { join, relative, resolve, sep } from 'node:path'
import pMap from 'p-map'
import { format } from 'prettier'

import { $, fs, globby } from 'zx'
import {
  __dirname,
  extractBlockInfo,
  HEADER,
  optimizePreview,
  renderImport,
  renderMapPair,
  TYPE_DEFINE,
} from './utils.mts'

const articlesPath = resolve(__dirname, '../articles')
const otherPagePath = resolve(__dirname, '../other-pages')

async function importedExtractPreview(rootPath: string, block: string): Promise<string | false> {
  const previewPath = join(block, 'preview.webp')
  if (await fs.pathExists(join(rootPath, previewPath))) {
    return previewPath
  }
  console.info(`fail to import ${block} because of missing preview image`)
  return false
}

function extractPathInfo(path: string): { name: string; templatePath: string } {
  const [name] = path.split(sep)
  return { name: name.replace(/^article-/, ''), templatePath: name }
}

async function collectImportedBlock(rootPath: string): Promise<TemplateInfo[]> {
  const blocksPaths = (await globby(join(rootPath, '**/block/index.js'), { ignore: ['**/__*/block/index.js'] })).map(
    (path) => relative(rootPath, path)
  )
  return pMap(blocksPaths, (path) =>
    extractBlockInfo(path, importedExtractPreview.bind(this, rootPath), extractPathInfo)
  )
}

async function generateIndex(rootPath: string) {
  await optimizePreview(rootPath)
  const info = (await collectImportedBlock(join(rootPath, 'source')))
    .filter((x) => x != null)
    .map((info, index) => ({
      ...info,
      entry: join('./source', info.entry),
      preview: info.preview ? join('./source', info.preview) : info.preview,
      index,
    }))
  const source = `
    ${HEADER}
    ${renderImport(info)}

${TYPE_DEFINE}

export { DEFAULT_TEMPLATE, Fallback } from './fallback'


    export const TEMPLATE_MAP: Record<string, Component> = {
      ${renderMapPair(info)}
    }

    export const PREVIEW_MAP: Record<string, string> = {
      ${renderPreviewMap(info)}
    }
  `
  fs.writeFile(join(rootPath, 'index.ts'), await format(source, { parser: 'babel-ts', semi: false, singleQuote: true }))
  await $`yarn eslint --fix ${join(rootPath, 'index.ts')}`
}

generateIndex(articlesPath)
generateIndex(otherPagePath)

function renderPreviewMap(info: TemplateInfo[]) {
  return info.map(({ preview, name, index }) => `'${name}': ${renderPreview(preview, index)},`).join('\n')
}

function renderPreview(preview: string | null, index: number) {
  return preview ? `preview${index}` : 'null'
}
