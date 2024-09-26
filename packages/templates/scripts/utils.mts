import type { Promisable } from 'type-fest'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'
import pMap from 'p-map'
import { globby } from 'zx'

export interface TemplateInfo {
  index: number
  name: string
  entry: string
  preview?: string
}

export const __dirname = dirname(fileURLToPath(import.meta.url))

function delay(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

export async function optimizePreview(base: string) {
  const paths = await globby(join(base, '**/*.{png,jpg,jpeg}'), { absolute: true })
  await pMap(paths, (path) => {
    imagemin([path], { plugins: [imageminWebp()], destination: dirname(path) })
  })
  await delay(1000)
}

export async function extractBlockInfo<T extends TemplateInfo>(
  path: string,
  extractPreview: (block: string) => Promisable<boolean | string>,
  extractPathInfo: (p: string) => Omit<T, 'index' | 'preview' | 'entry'> & { templatePath: string }
): Promise<T | null> {
  const { templatePath, ...info } = extractPathInfo(path)
  const preview = await extractPreview(templatePath)
  if (typeof preview === 'string') {
    return {
      index: -1,
      entry: path,
      preview,
      ...info,
    } as unknown as T
  }
  if (preview) {
    return {
      index: -1,
      entry: path,
      ...info,
    } as unknown as T
  }
  return null
}

export const HEADER = `import { Component } from 'vue'`
export const TYPE_NAME = 'ItemDescriptor'
export const TYPE_DEFINE = `
export interface ${TYPE_NAME} {
  name: string
  component: Component
  preview: string | null
}
`

export function renderInfo(info: TemplateInfo[]) {
  return info
    .map(
      ({ index, name, preview }) =>
        `{name: '${name}', component: ${renderItem(index)}, preview: ${renderPreviewVariable(preview, index)}},
      `
    )
    .join('')
}

export function renderPreviewVariable(preview: string | undefined, index: number) {
  return preview ? renderItem(index, 'preview') : ''
}

export function renderImport(blocks: TemplateInfo[]): string {
  return blocks
    .map(
      ({ entry, preview, index }) => `import ${renderItem(index)} from './${entry}'
      ${renderPreviewImport(preview, index)}
  `
    )
    .join('')
}

function renderPreviewImport(preview: string | undefined, index: number) {
  return preview ? `import ${renderItem(index, 'preview')} from './${preview}'` : ''
}

export function renderMapPair(blocks: TemplateInfo[]): string {
  return blocks
    .map(
      ({ name }, i) => `'${name}': ${renderItem(i)},
  `
    )
    .join('')
}

function renderItem(index: number, name: string = 'Item') {
  return `${name}${index}`
}
