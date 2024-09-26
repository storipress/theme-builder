import type Vue from 'vue'
import type { StyleProps } from '../../utils/style-props'
import { Evt, to } from 'evt'
import { debounce } from 'lodash'
import { contrast, findBackgroundProvider } from 'shared/utils'

import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue-demi'
import { useStyles } from '../../utils/style-props'
import { useArticleElement } from '../inject'

interface Props extends StyleProps {
  kind: string
}

export function useInput(props: Props, key: 'title' | 'blurb', nextFocus: string) {
  const input = ref<Vue & { focus: () => void }>()
  const sync = ref(true)
  const innerInput = ref('')
  const variant = ref('active-light')
  const inputClass = ref('placeholder-opacity-25')

  const $element = useArticleElement()

  watch(
    () => $element.value[key],

    (val: string) => {
      if (sync.value) {
        innerInput.value = val
      }
    },
    {
      immediate: true,
    }
  )

  watch(sync, (val) => {
    if (val) {
      $element.value[key] = innerInput.value
    } else {
      innerInput.value = $element.value[key]
    }
  })

  onMounted(async () => {
    const focusable = input.value!
    const ctx = Evt.newCtx()

    $element.value.bus.$attach(to('focus'), ctx, (name) => {
      if (name === key) {
        focusable.focus()
      }
    })

    onBeforeUnmount(() => {
      ctx.done()
    })

    // wait dynamic style ready
    await nextTick()
    const styles = window.getComputedStyle(findBackgroundProvider(focusable.$el))
    const contrastColor = contrast(styles.backgroundColor)
    variant.value = `active-${contrastColor}`
    inputClass.value += ` placeholder-${contrastColor === 'light' ? 'black' : 'white'}`
  })

  return {
    input,

    sync,
    innerInput,
    inputClass,
    variant,
    path: computed(() => ['article', props.kind]),
    styles: useStyles(props),

    handleEnter(event: KeyboardEvent) {
      // ignore enter when composing because it's used for commit text
      if (event.isComposing && event.key === 'Enter') {
        return
      }
      $element.value.bus.post(['focus', nextFocus])
    },

    debounceUpdate: debounce(() => {
      $element.value[key] = innerInput.value
    }, 5000),
  }
}
