import { join, resolve } from 'node:path'
import { format } from 'prettier'
import { fs } from 'zx'

import { __dirname } from './utils.mts'

const otherBlockPath = resolve(__dirname, '../other-blocks')
const blockquotePath = resolve(otherBlockPath, 'blockquote')

// generate code to import style.scss and index.ts content for each directory
async function main() {
  const names = await fs.readdir(join(blockquotePath, 'source'))

  names.sort()

  const code = `
  ${names.map((name) => renderStyleImport(name)).join('\n')}

  ${names.map((name) => renderImport(name)).join('\n')}

export const BLOCKQUOTES: Record<string, Record<string, unknown>> = Object.fromEntries(
  [${names.join(', ')}].map((mod) => {
    const { name, style } = mod
    return [name, style as Record<string, unknown>]
  })
)


  `

  await fs.writeFile(
    join(blockquotePath, 'index.ts'),
    await format(code, { parser: 'babel-ts', semi: false, printWidth: 120, singleQuote: true })
  )
}

function renderStyleImport(name: string) {
  return `import './source/${name}/style.scss'`
}

function renderImport(name: string) {
  return `import * as ${name} from './source/${name}'`
}

main()
