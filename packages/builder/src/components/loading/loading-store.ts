import pDefer from 'p-defer'
import pTimeout from 'p-timeout'
import { defineStore } from 'pinia'
import { ref } from 'vue-demi'

export const useLoadingStore = defineStore('loading', () => {
  const isMasked = ref(false)
  const isSpinning = ref(false)
  const hasError = ref(false)
  const tip = ref('')
  const waiting = new Set()

  return {
    isMasked,
    isSpinning,
    hasError,
    tip,
    waitUntil() {
      const defer = pDefer()
      this.waitPromise(defer.promise)
      return defer.resolve
    },
    async waitPromise<T>(promise: Promise<T>, errorMessage?: string): Promise<T> {
      waiting.add(promise)
      isMasked.value = true
      if (waiting.size === 0) {
        hasError.value = false
      }
      try {
        const res = await pTimeout(promise, 200)
        waiting.delete(promise)
        return res
      } catch (error) {
        if (!(error instanceof pTimeout.TimeoutError)) {
          hasError.value = true
          if (errorMessage) {
            tip.value = errorMessage
          }
          throw error
        }
      } finally {
        // it's ok to remove the mask here even if the promise is not resolved
        // because spinner also has a mask
        isMasked.value = false
      }
      isSpinning.value = true
      try {
        return await promise
      } catch (error) {
        hasError.value = true
        if (errorMessage) {
          tip.value = errorMessage
        }
        throw error
      } finally {
        waiting.delete(promise)
        if (waiting.size === 0) {
          isSpinning.value = false
        }
      }
    },
  }
})
