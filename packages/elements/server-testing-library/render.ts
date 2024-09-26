import type { BoundFunctions, prettyFormat, queries } from '@testing-library/dom'
import type { ThisTypedMountOptions } from '@vue/server-test-utils'
import type { ComponentOptions, FunctionalComponentOptions } from 'vue'
import type Vue from 'vue'
import type { RouteConfig } from 'vue-router'
import type Router from 'vue-router'
import type { Store, StoreOptions } from 'vuex'
import { getQueriesForElement, prettyDOM } from '@testing-library/dom'
import { renderToString } from '@vue/server-test-utils'
import { createLocalVue } from '@vue/test-utils'

const mountedWrappers = new Set<HTMLElement>()

type VueClass<V extends Vue> = (new (...args: any[]) => V) & typeof Vue

export interface RenderOptions<V extends Vue, S = {}>
  // The props and store options special-cased by Vue Testing Library and NOT passed to mount().
  extends Omit<ThisTypedMountOptions<V>, 'store' | 'props'> {
  props?: object
  context?: object
  store?: StoreOptions<S>
  routes?: RouteConfig[]
  container?: Element
  baseElement?: Element
}

export interface RenderResult extends BoundFunctions<typeof queries> {
  container: Element
  baseElement: Element
  debug: (
    baseElement?: Element | DocumentFragment | Array<Element | DocumentFragment>,
    maxLength?: number,
    options?: prettyFormat.OptionsReceived
  ) => void
  unmount: () => void
  isUnmounted: () => boolean
  html: () => string

  emitted: () => { [name: string]: any[][] }
  updateProps: (props: object) => Promise<void>
}

type ConfigurationArgs = [localVue: typeof Vue, store: Store<any>, router: Router]

export type ConfigurationCallback<V extends Vue> =
  | ((...args: ConfigurationArgs) => Partial<ThisTypedMountOptions<V>>)
  | ((...args: ConfigurationArgs) => void)

async function render<V extends Vue>(
  Component: VueClass<V> | ComponentOptions<V> | FunctionalComponentOptions<any, any>,
  {
    store,
    routes,
    container: customContainer,
    baseElement: customBaseElement,
    context = {},
    ...mountOptions
  }: Partial<RenderOptions<V>> = {},
  configurationCb?: ConfigurationCallback<V>
) {
  const div = document.createElement('div')
  const baseElement = customBaseElement || customContainer || document.body

  const container = customContainer || baseElement.appendChild(div)

  const localVue = createLocalVue()
  let vuexStore = null
  let router = null
  let callbackOptions: {} | void = {}
  Object.defineProperty(localVue.prototype, '$ssrContext', {
    get: () => context,
    enumerable: false,
  })

  if (store) {
    const Vuex = require('vuex')
    localVue.use(Vuex)

    vuexStore = new Vuex.Store(store)
  }

  if (routes) {
    const requiredRouter = require('vue-router')
    const VueRouter = requiredRouter.default || requiredRouter
    localVue.use(VueRouter)

    router = new VueRouter({ routes })
  }

  if (configurationCb && typeof configurationCb === 'function') {
    callbackOptions = configurationCb(localVue, vuexStore, router)
  }

  if (!mountOptions.propsData && !!mountOptions.props) {
    mountOptions.propsData = mountOptions.props
    delete mountOptions.props
  }

  // make typescript happy
  const { props, ...rest } = mountOptions

  // eslint-disable-next-line testing-library/render-result-naming-convention
  const html = await renderToString(Component as any, {
    localVue,
    router,
    store: vuexStore,
    ...rest,
    ...callbackOptions,
  })

  mountedWrappers.add(container as HTMLElement)
  // eslint-disable-next-line no-unsanitized/property
  container.innerHTML = html

  return {
    container,
    baseElement,
    debug: (el = baseElement, ...args: any) =>
      Array.isArray(el) ? el.forEach((e) => console.log(prettyDOM(e, ...args))) : console.log(prettyDOM(el, ...args)),
    unmount: () => container.remove(),
    html: () => container.innerHTML,
    ...getQueriesForElement(baseElement as HTMLElement),
  }
}

function cleanup() {
  mountedWrappers.forEach((container) => cleanupAtWrapper(container))
}

function cleanupAtWrapper(container: HTMLElement) {
  container.remove()

  mountedWrappers.delete(container)
}

export { cleanup, render }

if (typeof afterEach === 'function') {
  afterEach(cleanup)
}
