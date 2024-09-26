import { compileToString, config } from 'eta'

const options = {
  autoEscape: false,
}

const styleOptions = {
  rmWhitespace: true,
  autoTrim: 'slurp' as const,
  tags: ['{{', '}}'] as [string, string],
}

export function eta(code: string, filename: string) {
  const template = compileToString(code, {
    ...config,
    ...options,
    ...(filename.endsWith('.ejs') ? styleOptions : {}),
    includeFile: () => {
      throw new Error('includeFile is not support in eta hook')
    },
  })

  return `module.exports = function (it, E, cb) {
    if (!E.includeFile) {
      E.includeFile = () => {}
    }
    ${template}
  }`
}
