declare module '*.ejs' {
  import type { compile } from 'eta'

  const template: ReturnType<typeof compile>
  export default template
}
