import { htmlToText } from 'html-to-text'
import { truncate } from 'lodash'

export function fromHTML(html: string): string {
  const text = htmlToText(html, {
    wordwrap: 80,
    ignoreImage: true,
    hideLinkHrefIfSameAsText: true,
    preserveNewlines: true,
    returnDomByDefault: true,
    uppercaseHeadings: false,
  })
  return fromPlainText(text)
}

export function fromPlainText(text: string = ''): string {
  return text && text.replaceAll
    ? truncate(text.replaceAll(/\s+/g, ' '), {
        // description length
        length: 120,
        // don't cut on word
        separator: /,? +/,
      })
    : ''
}
