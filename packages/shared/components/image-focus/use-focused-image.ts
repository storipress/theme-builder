import type { Focus } from '@storipress/image-focus'
import type { Ref } from 'vue-demi'
import { FocusedImage } from '@storipress/image-focus'
import { nextTick, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue-demi'

interface Extractor<Input> {
  (r: Input): HTMLImageElement
}

interface UseFocusedImageOptions<T> {
  extractor: Extractor<T>
  src: Readonly<Ref<string | undefined>>
  focus: Readonly<Ref<Focus>>
}

export function useFocusedImage<T>({ extractor, src, focus }: UseFocusedImageOptions<T>) {
  const image = ref<T>()

  onMounted(() => {
    const $img = extractor(unref(image as Ref<T>))
    const focusedImage = new FocusedImage($img, {
      updateOnContainerResize: true,
      focus: focus.value || { x: 0, y: 0 },
    })

    watch(
      src,
      async (src, old) => {
        if (!src) {
          return
        }

        const isDataUrl = src.startsWith('data:')
        const oldIsDataUrl = old?.startsWith('data:') ?? false
        if (isDataUrl === oldIsDataUrl) {
          return
        }

        await nextTick()

        focusedImage.applyShift()

        if (isDataUrl) {
          focusedImage.stopListening()

          await nextTick()
          // reset shift for svg image
          focusedImage.resetShift()
        } else {
          focusedImage.startListening()
        }
      },
      { immediate: true }
    )

    // FIXME: no idea why the above watch doesn't work
    setTimeout(() => {
      if (src.value?.startsWith('data:')) {
        focusedImage.resetShift()
      }
    }, 1000)

    watch(focus, (focus) => {
      focusedImage.setFocus(focus || { x: 0, y: 0 })
    })

    onBeforeUnmount(() => {
      focusedImage.stopListening()
    })
  })

  return {
    image,
  }
}
