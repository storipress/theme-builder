import { mapValues } from 'lodash'
import { computed, getCurrentInstance, VueConstructor } from 'vue-demi'
import { ActionMethod, mapActions, mapMutations, MutationMethod, Store } from 'vuex'

import { ActionMap, Dictionary, GetterMap, ModuleKey, MutationMap, StateMap } from './types'
import { generateComputedDict, generateMethodDict, validateNamespace } from './utils'

const _context: {
  state: Dictionary
  actions: Dictionary
  mutations: Dictionary
  getters: Dictionary
} = {
  state: {},
  actions: {},
  mutations: {},
  getters: {},
}

export default function (_vc: VueConstructor): void {}

function getVM(): Vue {
  const vm = getCurrentInstance()?.proxy
  if (!vm) {
    throw new Error('[vuex-hooks] vue instance is undefined, Vue.use must be called before using the plugin')
  }
  return vm
}

export function useStore<RootState = any>(): Store<RootState> {
  const vm = getVM()
  return vm.$store as Store<RootState>
}

function mapFromStore<R>(type: ModuleKey, namespace: string): R {
  validateNamespace(namespace, type)
  if (!_context[type][namespace]) {
    _context[type][namespace] =
      type === 'state' || type === 'getters'
        ? generateComputedDict(getVM(), namespace, type)
        : generateMethodDict(getVM(), namespace, type)
  }
  return _context[type][namespace] as R
}

export function useState<T = any>(namespace: string): StateMap<T> {
  return mapFromStore<StateMap<T>>('state', namespace)
}

export function useGetters<T = any>(namespace: string): GetterMap<T> {
  return mapFromStore<GetterMap<T>>('getters', namespace)
}

export function useMutations<T = any>(namespace: string): MutationMap<T> {
  return mapFromStore<MutationMap<T>>('mutations', namespace)
}

export function useActions<T = any>(namespace: string): ActionMap<T> {
  return mapFromStore<ActionMap<T>>('actions', namespace)
}

export function useRootActions<T = any, const Keys extends (keyof T)[] = (keyof T)[]>(actions: Keys): ActionMap<T> {
  const vm = getVM()
  return mapValues(mapActions(actions as string[]), (action: ActionMethod) => action.bind(vm)) as ActionMap<T>
}

export function useRootMutations<T = any, const Keys extends (keyof T)[] = (keyof T)[]>(keys: Keys): MutationMap<T> {
  const vm = getVM()
  return mapValues(mapMutations(keys as string[]), (mutation: MutationMethod) => mutation.bind(vm)) as MutationMap<T>
}

export function useRootState<T = any, const Keys extends (keyof T)[] = (keyof T)[]>(keys: Keys): StateMap<T> {
  const store = useStore()

  return Object.fromEntries(keys.map((key) => [key, computed(() => store.state[key])])) as unknown as StateMap<T>
}

export function useRootGetters<T = any, const Keys extends (keyof T)[] = (keyof T)[]>(keys: Keys): GetterMap<T> {
  const store = useStore()

  return Object.fromEntries(keys.map((key) => [key, computed(() => store.getters[key])])) as unknown as GetterMap<T>
}
