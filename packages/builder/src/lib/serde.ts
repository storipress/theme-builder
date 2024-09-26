import { parse, stringify } from 'devalue'
import { isReactive, isRef, isShallow, reactive, ref, shallowRef, toRaw } from 'vue'

const serializeReducers = {
  Reactive: (obj: unknown) => {
    if (isReactive(obj)) {
      // vue 2 is same reference
      return structuredClone(obj)
    }
  },
  Ref: (obj: unknown) => {
    if (isRef(obj) && !isShallow(obj)) {
      return toRaw(obj.value)
    }
  },
  ShallowRef: (obj: unknown) => {
    if (isRef(obj) && isShallow(obj)) {
      return toRaw(obj.value)
    }
  },

  FreezedArray: (obj: unknown) => {
    if (typeof obj === 'object' && Object.isFrozen(obj) && Array.isArray(obj)) {
      return [...obj]
    }
  },
  FreezedObject: (obj: unknown) => {
    if (typeof obj === 'object' && Object.isFrozen(obj) && !Array.isArray(obj) && obj !== null) {
      return {
        ...obj,
      }
    }
  },
}

export function serialize(obj: unknown) {
  return stringify(obj, serializeReducers)
}

const deserializeReducers = {
  Reactive: (obj: unknown) => {
    return reactive(obj as Record<string, unknown>)
  },
  Ref: (obj: unknown) => {
    return ref(obj)
  },
  ShallowRef: (obj: unknown) => {
    return shallowRef(obj)
  },
  FreezedArray: (obj: unknown) => {
    return Object.freeze(obj)
  },
  FreezedObject: (obj: unknown) => {
    return Object.freeze(obj)
  },
}

export function deserialize<T>(json: string): T {
  return parse(json, deserializeReducers)
}
