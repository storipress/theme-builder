import type { Ref } from 'vue-demi'
import { inject, ref } from 'vue-demi'

export interface Site {
  name: string
  facebook?: null | string
  twitter?: null | string
}

export interface CommonInjected {
  site: Site
  logo: string
  scale: number
}

const INJECTED_DEFAULT: CommonInjected = {
  site: {
    name: '',
  },
  logo: '',
  scale: 1,
}

export function useElement(): Ref<CommonInjected> {
  return ref(inject('$element', INJECTED_DEFAULT))
}
