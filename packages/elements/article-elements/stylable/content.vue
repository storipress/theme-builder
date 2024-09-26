<script lang="ts">
import { debounce } from 'lodash'
import { clickOutside } from 'shared/directives/click-outside'
import { computed, defineComponent, onBeforeUnmount, onMounted, provide, ref } from 'vue-demi'

import { useArticleElement } from '../inject'
import { findDropcap } from './drop-cap'

export default defineComponent({
  directives: { clickOutside },
  setup() {
    const root = ref<HTMLElement>()
    const left = ref(0)

    provide(
      'registerContentElement',

      (kind: string, $el: Element) => {
        if (kind === 'p' && root.value?.querySelector('p') === $el) {
          return [findDropcap]
        }
        return []
      }
    )

    const element = useArticleElement()

    onMounted(() => {
      const observer = new ResizeObserver(
        debounce(() => {
          const rect = root.value!.getBoundingClientRect()
          left.value = rect.left
        }, 10)
      )
      observer.observe(root.value as HTMLElement)

      onBeforeUnmount(() => {
        observer.disconnect()
      })
    })

    return {
      root,
      left,
      elementStyles: computed((): string[] => {
        return [...Object.entries(element.value.elements)].map(([key, value]) => `${key}--${value}`)
      }),
      handleClickOutside(event?: MouseEvent) {
        if (!event) {
          element.value.setSectionSelect(null)
          return
        }

        if (!element.value.selectable || !event.target) {
          return
        }

        element.value.setSectionSelect(null)
      },
    }
  },
})
</script>

<template>
  <div ref="root" class="article-content" :class="elementStyles" :style="`--left-offset: ${left}px`">
    <div v-click-outside="handleClickOutside" class="main-content">
      <slot />
    </div>
  </div>
</template>
