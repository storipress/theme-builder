declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'vue/types/vue' {
  interface Storipress {
    clientID: string
  }

  interface Vue {
    $storipress: Storipress
  }
}

declare module '*.svg?external' {
  const url: string

  export default url
}

declare module '*.svg?inline' {
  const url: string

  export default url
}

declare module '*.svg' {
  import Vue from 'vue'

  export default Vue
}
