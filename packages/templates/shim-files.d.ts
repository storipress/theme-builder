declare module '*.vue' {
  import Vue from 'vue'

  export default Vue
}

declare module '*.svg' {
  import Vue from 'vue'

  export default Vue
}

declare module '*.png' {
  const path: string

  export default path
}

declare module '*.webp' {
  const path: string

  export default path
}

declare module '*.module.scss' {
  const classNames: Record<string, string>

  export default classNames
}

declare module '*.ejs' {
  import type { compile } from 'eta'

  const template: ReturnType<typeof compile>

  export default template
}

declare module '*.eta' {
  import type { compile } from 'eta'

  const template: ReturnType<typeof compile>

  export default template
}

declare module '*.svg?external' {
  const url: string

  export default url
}

declare module '*.svg?inline' {
  const url: string

  export default url
}
