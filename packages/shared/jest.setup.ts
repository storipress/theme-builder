import { TextDecoder, TextEncoder } from 'node:util'

global.TextEncoder = TextEncoder
// @ts-expect-error type mismatch
global.TextDecoder = TextDecoder
