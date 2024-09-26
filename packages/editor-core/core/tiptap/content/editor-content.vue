<script lang="ts">
import type { Editor } from '@tiptap/vue-2'
import type Vue from 'vue'
import type { PropType } from 'vue-demi'
import { EditorContent } from '@tiptap/vue-2'
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue-demi'
import { useMutations } from 'vuex-hooks'

export default defineComponent({
  components: {
    EditorContent,
  },
  props: {
    editor: {
      required: true,
      type: Object as PropType<Editor>,
    },
  },

  setup() {
    const root = ref<Vue>()
    const mutations = useMutations('editorState')

    onMounted(() => {
      const $root = (root.value as Vue).$el as HTMLElement

      const setEditorTop = () => {
        const { top } = $root.getBoundingClientRect()
        mutations.SET_EDITOR_TOP(top)
      }

      const observer = new ResizeObserver(setEditorTop)
      observer.observe($root)

      window.addEventListener('scroll', setEditorTop, { passive: true })

      onBeforeUnmount(() => {
        observer.disconnect()
        window.removeEventListener('scroll', setEditorTop)
      })
    })

    return { root }
  },
})
</script>

<template>
  <EditorContent ref="root" class="tiptap-content" :editor="editor" />
</template>

<style lang="scss" src="shared/content.scss"></style>

<style lang="scss">
.tiptap-content {
  // stylelint-disable-next-line selector-class-pattern
  .ProseMirror {
    &:focus {
      @apply outline-none;
    }
  }

  // Editor specific style

  .is-editor-empty {
    &.empty-node:only-child {
      &::before {
        @apply absolute cursor-text font-light text-black text-opacity-25;

        content: attr(data-placeholder);
      }
    }
  }

  .article-content {
    li {
      p.empty-node {
        &::before {
          content: '';
          color: transparent;
        }
      }
    }
  }

  .comment {
    background-color: yellow;
  }

  .interactive-node {
    @apply ring-clear-blue transition-shadow;

    &:hover {
      @apply ring-1;
    }

    &.has-focus {
      @apply ring-2;
    }
  }
}

.tippy-content div {
  visibility: visible !important;
}
</style>

<style lang="scss" scoped>
.tiptap-content {
  text-align: left;
}
</style>
