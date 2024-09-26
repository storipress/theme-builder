<script lang="ts">
import type { Props } from 'tippy.js'
import type { Marks } from './schema'
import { BubbleMenu, EditorContent } from '@tiptap/vue-2'

import { defineComponent, onBeforeUnmount, onMounted, readonly, ref, watch } from 'vue-demi'
import LinkMenu from '../common/link-menu.vue'
import { LinkEdit } from '../core/tiptap/link-edit'
import { createEditor, MARK_TO_COMMAND, update } from './create-editor'

interface Format {
  name: string
  action: Marks
  icon: string
}

export default defineComponent({
  components: { EditorContent, BubbleMenu, LinkMenu, LinkEdit },

  props: {
    placeholder: {
      type: String,
    },
    value: {
      type: String,
    },
  },

  setup(props, { emit }) {
    const editor = createEditor({
      content: props.value as string,
      placeholder: props.placeholder,
      onUpdate: ({ toHTML }) => {
        emit('input', toHTML())
      },
    })

    const tippyOptions: Partial<Props> = {
      duration: 150,
      arrow: false,
      onHide(instance) {
        instance.popper.firstElementChild!.classList.remove('opacity-100')
      },
      onMount(instance) {
        instance.popper.firstElementChild!.classList.add('transition-opacity', 'opacity-0')
      },
      onShow(instance) {
        instance.popper.firstElementChild!.classList.add('opacity-100')
      },
    }

    const formats: readonly Format[] = readonly([
      {
        name: 'Bold',
        action: 'strong',
        icon: 'icon-format_bold',
      },
      {
        name: 'Italic',
        action: 'em',
        icon: 'icon-format_italics',
      },
      {
        name: 'Underline',
        action: 'u',
        icon: 'icon-format_underline',
      },
    ])

    const linkMode = ref(false)

    watch(
      () => props.value,
      (value) => {
        if (editor && value != null) {
          update(editor, value)
        }
      }
    )

    onMounted(() => {
      editor.view.dom.classList.add('no-drop')
    })

    onBeforeUnmount(() => {
      editor.destroy()
    })

    return {
      editor,

      tippyOptions,

      formats,

      linkMode,

      toggleLink() {
        if (editor.isActive('link')) {
          editor.commands.unsetLink()
        } else {
          linkMode.value = true
        }
      },

      setLink(href: string) {
        if (href) {
          editor.commands.setLink({ href })
        }
        linkMode.value = false
      },

      focus() {
        editor.view.focus()
      },

      applyFormat(name: Marks) {
        editor.commands[MARK_TO_COMMAND[name]]({} as any)
      },
    }
  },
})
</script>

<template>
  <div class="rich-input" @click.stop>
    <EditorContent :editor="editor" style="white-space: pre-wrap" />

    <BubbleMenu class="menu-wrapper" :editor="editor" :tippy-options="tippyOptions">
      <div class="format format-link" @click="toggleLink">
        <span class="icon-link_variant" />
        <span class="ml-1">Link</span>
      </div>

      <div class="divider" />

      <button
        v-for="format in formats"
        :key="format.name"
        class="format"
        :class="[`format-${format.name.toLowerCase()}`]"
        @click="applyFormat(format.action)"
      >
        <span :class="format.icon" />
      </button>

      <LinkMenu v-if="linkMode" style="top: 65px" @input="setLink" />
      <LinkEdit :editor="editor" />
    </BubbleMenu>
  </div>
</template>

<style lang="scss" scoped>
.rich-input {
  @apply relative;

  &::v-deep {
    & > div {
      font-family: inherit;
    }

    // stylelint-disable-next-line selector-class-pattern
    .ProseMirror {
      font-family: inherit;

      &:focus {
        @apply outline-none;
      }
    }

    h1,
    h2,
    h3,
    p,
    blockquote,
    pre,
    ul,
    ol {
      margin: 0;
      font-family: inherit;
    }

    .is-editor-empty {
      &.empty-node:only-child {
        &::before {
          @apply absolute inset-0 block w-full cursor-text whitespace-nowrap font-light text-black text-opacity-25;

          content: attr(data-placeholder);
        }
      }
    }
  }

  .menu-wrapper {
    @apply flex;

    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 5px 2px rgb(0 0 0 / 10%);
    height: 2rem;

    &.hidden {
      display: none;
    }

    .format {
      @apply flex items-center justify-center;

      color: #9f9f9f;
      min-width: 2rem;
      height: 100%;
      padding: 0.5rem 0.25rem;
      transition: background-color 50ms ease;

      &:hover {
        background-color: #f0f0f0;
      }

      &.format-active {
        color: #7bc7f9;
      }

      &.format-bold,
      &.format-italic,
      &.format-underline {
        span {
          font-size: 0.8rem;
        }
      }

      &.format-underline {
        padding-top: 0.55rem;
        padding-bottom: 0.45rem;

        span {
          font-size: 0.9rem;
        }
      }

      &.format-link {
        color: #595959;
        font-size: 0.8rem;
        padding-right: 0.625rem;
        padding-left: 0.625rem;
      }
    }

    .divider {
      background-color: rgb(0 0 0 / 15%);
      height: 100%;
      width: 1px;
    }
  }
}
</style>
