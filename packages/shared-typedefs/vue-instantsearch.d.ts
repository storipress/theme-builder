declare module 'vue-instantsearch' {
  const plugin: any

  export default plugin
}

declare module 'vue-instantsearch/es/src/widgets' {
  import type { Component } from 'vue'

  export const AisInstantSearch: Component
  export const AisSearchBox: Component
  export const AisHits: Component
}
