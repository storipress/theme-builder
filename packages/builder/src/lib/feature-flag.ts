import type { Attributes, FeatureDefinition, FeatureResult, JSONValue } from '@growthbook/growthbook'
import type { DeepReadonly, Ref } from 'vue-demi'
import { GrowthBook } from '@growthbook/growthbook'
import * as Sentry from '@sentry/vue'
import ky from 'ky'
import { noop, once } from 'lodash-es'
import { nanoid } from 'nanoid'
import { computed, onScopeDispose, readonly, ref, watch } from 'vue-demi'

import { env } from '../env'

// Create a GrowthBook instance
const growthbook = new GrowthBook()

export const deviceId = localStorage.getItem('storipress-device-id') || nanoid()

const getFeatureUpdateSignal = once(() => ref(0))

const FEATURES_ENDPOINT = env.FEATURES_ENDPOINT

const DEFAULT_ATTRIBUTES: Attributes = {
  id: '',
  deviceId,
  loggedIn: false,
  browser: navigator.userAgent,
  clientID: '',
  role: 'contributor',
  plan: 'free',
  env: 'production',
  url: window.location.pathname,
}

export function useGrowthBookInit() {
  loadFeatures()

  const signal = getFeatureUpdateSignal()

  growthbook.setAttributes(DEFAULT_ATTRIBUTES)

  growthbook.setRenderer(() => {
    signal.value++
  })

  onScopeDispose(() => {
    growthbook.setRenderer(noop)
  })
}

export function setAttributes(attributes: Readonly<Attributes>) {
  growthbook.setAttributes(attributes)
}

export function updateAttributes(partialAttributes: Readonly<Attributes>) {
  const attributes = {
    ...growthbook.getAttributes(),
    ...partialAttributes,
  }
  setAttributes(attributes)
}

async function loadFeatures() {
  try {
    const json = await ky.get(FEATURES_ENDPOINT).json<{ features: Record<string, FeatureDefinition> }>()
    growthbook.setFeatures(json.features)
  } catch (error) {
    Sentry.captureException(error)
  }
}

export function useGrowthBook() {
  return growthbook
}

// skipcq: JS-0323
export function useFeature<T extends JSONValue = any>(key: string): DeepReadonly<Ref<FeatureResult<T>>> {
  const feature = ref(growthbook.feature(key))
  const signal = getFeatureUpdateSignal()

  watch(signal, () => {
    feature.value = growthbook.feature(key)
  })

  return readonly(feature)
}

export function useFeatureFlag(key: string): Readonly<Ref<boolean>> {
  const feature = useFeature(key)

  return computed(() => feature.value.on)
}

export function useFeatureFlagEvery(keys: string[]): Readonly<Ref<boolean>> {
  const flags = keys.map((key) => useFeatureFlag(key))

  return computed(() => flags.every((flag) => flag.value))
}

/**
 * NEVER USE THIS FUNCTION DIRECTLY
 * @deprecated don't use this in app code, use it in storybook or test, mark it as deprecated so you can see this warning
 */
export function enableFeatures(features: string[]) {
  growthbook.setFeatures(Object.fromEntries(features.map((key) => [key, { defaultValue: true }])))
}

export enum Flags {
  CustomSite = 'custom-site',
}
