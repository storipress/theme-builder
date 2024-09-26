import document from 'min-document'

globalThis.document = document

// @ts-expect-error patch api
globalThis.Element = document.createElement('div').constructor

document.querySelector = () => null

// @ts-expect-error patch api
globalThis.window = globalThis
