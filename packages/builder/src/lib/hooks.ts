import invariant from 'tiny-invariant'
import { computed, getCurrentInstance } from 'vue-demi'

const NO_INSTANCE_ERROR = 'must call this function in lifecycle hook or setup'

export function useRouter() {
  const instance = getCurrentInstance()
  invariant(instance, NO_INSTANCE_ERROR)
  return instance.proxy.$router
}

export function useRoute() {
  const instance = getCurrentInstance()
  invariant(instance, NO_INSTANCE_ERROR)
  return computed(() => instance.proxy.$route)
}
