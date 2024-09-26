import type { Ref } from 'vue-demi'
import { last } from 'lodash'
import invariant from 'tiny-invariant'
import { computed, inject } from 'vue-demi'

export function usePath(originalPath: Ref<string[]>, dataId?: Ref<string | null>) {
  const portal = inject<string | null>('portal', null)
  const kind = computed(() => {
    const kind = last(originalPath.value)
    invariant(kind, 'must have a least one key for path')
    return kind
  })

  const path = computed((): string[] => {
    const dataPath = portal != null ? ['@@portal', portal, kind.value] : originalPath.value
    return dataId?.value ? [...dataPath, dataId.value] : dataPath
  })

  return { kind, path, stylePath: originalPath }
}
