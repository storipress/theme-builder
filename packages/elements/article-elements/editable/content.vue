<script lang="ts">
import type { Editor } from '@tiptap/vue-2'
import { Tiptap } from '@storipress/editor-core'
import { Evt, to } from 'evt'
import { debounce } from 'lodash'
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue-demi'

import { useArticleElement } from '../inject'

export default defineComponent({
  components: { Tiptap },

  setup() {
    const root = ref<HTMLElement>()
    const left = ref(0)

    const element = useArticleElement()

    onMounted(() => {
      const { bus, editor } = element.value
      const ctx = Evt.newCtx()
      bus.$attach(to('focus'), ctx, (name: string) => {
        if (name === 'content') {
          ;(editor as Editor)?.view.focus()
        }
      })

      const observer = new ResizeObserver(
        debounce(() => {
          const $root = root.value
          if (!$root) {
            return
          }
          const rect = $root.getBoundingClientRect()
          // FIXME: no idea why need this
          left.value = rect.left - 8
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
      editor: computed(() => {
        return element.value.editor
      }),
      elementStyles: computed((): string[] => {
        return [...Object.entries(element.value.elements)].map(([key, value]) => `${key}--${value}`)
      }),
      info: computed(() => {
        return {
          preview: 'expanded',
          profile: element.value.profile,
        }
      }),
    }
  },
})
</script>

<template>
  <div ref="root" class="article-content" :style="`--left-offset: ${left}px`">
    <Tiptap :editor="editor" :collborative="true" :info="info" :extra-class="elementStyles" />
    <!-- place for placeholders, don't remove it -->
    <slot />
  </div>
</template>
