declare module 'is-animated' {
  function isAnimated(buffer: Buffer): boolean

  export default isAnimated
}

declare module 'is-animated/lib/types/png' {
  export function isPNG(buffer: Buffer): boolean
  export function isAnimated(buffer: Buffer): boolean
}
