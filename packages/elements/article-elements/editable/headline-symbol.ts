import type { InjectionKey, Ref } from 'vue-demi'

export const HEADLINE_TARGET: InjectionKey<Ref<HTMLElement>> = Symbol('headline-target')
