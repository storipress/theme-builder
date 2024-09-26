import { JSDOM } from 'jsdom'

const jsdom = new JSDOM('')

export const window = jsdom.window as unknown as Window
