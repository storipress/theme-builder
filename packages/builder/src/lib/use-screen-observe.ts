import { debounce } from 'lodash'
import { ref } from 'vue-demi'

let isInitialized = false

const innerWidth = ref(window.innerWidth)
const innerHeight = ref(window.innerHeight)

const updateScreen = debounce(() => {
  innerWidth.value = window.innerWidth
  innerHeight.value = window.innerHeight
}, 150)

export function useScreenObserve() {
  updateScreen()

  if (!isInitialized) {
    window.addEventListener('resize', updateScreen)
    isInitialized = true
  }

  return {
    innerWidth,
    innerHeight,
  }
}

export default {
  useScreenObserve,
}
