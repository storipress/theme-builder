<script lang="ts">
import type { Editor as CoreEditor } from '@tiptap/core'
import type { Editor } from '@tiptap/vue-2'
import type { Transaction } from 'prosemirror-state'
import type { PropType } from 'vue-demi'
import { Evt } from 'evt'
import { contrast, findBackgroundProvider } from 'shared/utils'
import { defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue-demi'
import { focus, redo, transaction, undo } from '../global-bus'

import { EditorContent } from './content'
import { ExtraSpace } from './extra-space'
import { FloatingMenu } from './floating-menu'
import { listener } from './iframe-resize-listener'
import { LinkEdit } from './link-edit'
import { BubbleMenu } from './menu'
import '@storipress/common-style/style.scss'

function postTransaction({ editor, transaction: tr }: { editor: CoreEditor; transaction: Transaction | null }) {
  transaction.post({ editor, tr })
}

export default defineComponent({
  components: {
    EditorContent,
    BubbleMenu,
    FloatingMenu,
    LinkEdit,
    ExtraSpace,
  },

  props: {
    editor: {
      type: Object as PropType<Editor>,
    },
    collborative: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
    },
    extraClass: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },

  setup(props) {
    const ctx = Evt.newCtx()
    const root = ref<HTMLElement>()
    const active = ref(false)
    const variant = ref('active-light')

    onMounted(async () => {
      undo.attach(ctx, () => {
        props.editor?.commands.undo()
      })

      redo.attach(ctx, () => {
        props.editor?.commands.redo()
      })

      focus.attach(ctx, () => {
        const { editor } = props
        if (!editor) {
          return
        }
        editor.commands.focus()
        editor.view.focus()
      })

      window.addEventListener('message', listener)

      await nextTick()
      const el = findBackgroundProvider(root.value as HTMLElement)
      const style = window.getComputedStyle(el)
      variant.value = `active-${contrast(style.backgroundColor)}`
    })

    function onFocus() {
      active.value = true
    }

    function onBlur() {
      active.value = false
    }

    watch(
      () => props.editor,
      async (editor) => {
        if (editor) {
          await nextTick()
          postTransaction({ editor, transaction: null })
          editor.on('transaction', postTransaction)
          editor.on('focus', onFocus)
          editor.on('blur', onBlur)
        }
      },
      { immediate: true }
    )

    onBeforeUnmount(() => {
      window.removeEventListener('message', listener)
      const { editor } = props
      if (editor) {
        editor.off('transaction', postTransaction)
        editor.off('focus', onFocus)
        editor.off('blur', onBlur)
      }
      ctx.done()
    })

    return {
      root,
      active,
      variant,
    }
  },
})
</script>

<template>
  <div ref="root" class="group relative cursor-text" :class="[active && $style.active, variant]">
    <BubbleMenu :editor="editor" />

    <FloatingMenu :editor="editor" />

    <LinkEdit :editor="editor" />

    <EditorContent class="p-2" :class="[$style.activeShadow, ...extraClass]" :editor="editor" />

    <ExtraSpace :class="$style.activeShadow" :editor="editor" />
  </div>
</template>

<style lang="scss" module>
.active-shadow {
  @apply transition-shadow;

  :global(.active-light).active &,
  :global(.group.active-light):hover & {
    @apply shadow-2;
  }

  :global(.active-dark).active &,
  :global(.group.active-dark):hover & {
    @apply shadow-w2;
  }
}
</style>

<style lang="scss">
.editor-menu-effect {
  &[data-state='hidden'] {
    @apply opacity-0;
  }

  &[data-state='visible'] {
    @apply opacity-100;
  }
}
</style>
