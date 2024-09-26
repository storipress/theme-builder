declare module 'space-separated-tokens' {
  export function stringify(tokens: string[]): string
  export function parse(value: string): string[]

  const _exported: { stringify: typeof stringify; parse: typeof parse }

  export default _exported
}
