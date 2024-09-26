<script lang="ts">
import type { Editor } from '@tiptap/core'
import type { PropType } from 'vue'
import type { LinkEditPluginProps } from './link-edit-plugin'
import copy from 'copy-to-clipboard'
import { noop } from 'lodash'

import Vue from 'vue'
import { LinkEditPlugin, LinkEditPluginKey } from './link-edit-plugin'

export default Vue.extend({
  props: {
    editor: {
      type: Object as PropType<Editor>,
    },
    tippyOptions: {
      type: Object as PropType<LinkEditPluginProps['tippyOptions']>,
      default: () => ({}),
    },
  },

  data() {
    return {
      // these value will inject by ProseMirror plugin
      active: false,
      url: '',
      update: noop as (url: string) => void,
      remove: noop as () => void,
    }
  },

  computed: {
    formattedLink(): string {
      if (!this.url) {
        return ''
      }

      let link = this.url

      if (!link.startsWith('http')) {
        link = `https://${link}`
      }

      return link
    },
  },

  watch: {
    editor: {
      async handler(editor: Editor, old: Editor) {
        if (old) {
          old.unregisterPlugin(LinkEditPluginKey)
        }
        if (editor) {
          await Vue.nextTick()
          editor.registerPlugin(
            LinkEditPlugin({
              editor,
              tippyOptions: this.tippyOptions as LinkEditPluginProps['tippyOptions'],
              element: this.$el as HTMLElement,
              onUpdate: (input) => {
                Object.assign(this, input)
              },
            })
          )
        }
      },
      immediate: true,
    },
  },

  beforeUnmount() {
    this.editor?.unregisterPlugin(LinkEditPluginKey)
  },

  methods: {
    copy() {
      copy(this.url, { format: 'text/plain' })
    },

    handleUpdate() {
      this.update(this.formattedLink)
    },
  },
})
</script>

<template>
  <div class="link-dialog" style="visibility: hidden">
    <input
      ref="input"
      v-model="url"
      placeholder="Edit link"
      type="url"
      @keydown.enter.prevent="handleUpdate"
      @change="handleUpdate"
    />

    <template>
      <div class="link-to-text">Link to</div>

      <a class="link-action" :href="formattedLink" target="_blank" rel="noopener nofollow noreferrer">
        <span class="icon-web" />

        <span class="external-link">{{ formattedLink }}</span>
      </a>

      <hr />

      <div class="link-action" @click="copy">
        <span class="icon-copy" />

        <span>Copy Link</span>
      </div>

      <div class="link-action" @click="remove">
        <span class="icon-delete" />

        <span>Remove Link</span>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.link-dialog {
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 3px 6px 30px 2px rgb(0 0 0 / 15%);
  width: 20rem;
  padding: 0.6rem 0.6rem 6px;

  input {
    align-items: center;
    background-color: #f0f0f0;
    border-style: solid;
    border-width: 2px;
    border-color: #b2def1;
    border-radius: 4px;
    height: 2.25rem;
    width: 100%;
    padding-left: 0.5rem;

    &:focus {
      outline: none;
    }
  }

  hr {
    margin: 0.3rem -0.6rem;
  }

  .link-to-text {
    color: rgb(61 61 61 / 40%);
    font-size: 0.625rem;
    font-weight: 700;
    line-height: 0.625rem;
    margin-top: 0.6rem;
    margin-bottom: 0.2rem;
    margin-left: 0.4rem;
    padding-top: 0.4rem;
    text-transform: uppercase;
  }

  .link-action {
    @apply flex items-center;
    @apply cursor-pointer;

    margin: 0 -0.6rem;
    padding: 0.5rem 2rem 0.5rem 1rem;
    transition: background-color 50ms ease;

    &:hover {
      background-color: #f0f0f0;
    }

    .external-link {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    span:first-of-type {
      color: rgb(0 0 0 / 70%);
    }

    span:not(:first-of-type) {
      color: #4c4c4c;
      font-size: 0.9rem;
      font-weight: 300;
      line-height: 100%;
      margin-left: 0.75rem;
    }
  }
}
</style>
