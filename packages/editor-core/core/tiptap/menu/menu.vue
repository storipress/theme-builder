<script lang="ts">
import type { Editor } from '@tiptap/vue-2'
import type { DeferredPromise } from 'p-defer'
import type { NodeSelection } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import type { Instance, Props } from 'tippy.js'
import type { Component, PropType } from 'vue'
import type { ActionableFormat, ActionFormat, EventFormat, Format } from './format-list'
import { BubbleMenu } from '@tiptap/vue-2'
import pDefer from 'p-defer'
import { findParentNodeOfType, isNodeSelection } from 'prosemirror-utils'
import Icon from 'shared/components/icon.vue'

import { defineComponent } from 'vue'
import LinkMenu from '../../../common/link-menu.vue'
import { isMac } from '../../utils'
import { FORMAT, linkFormat, newFormats } from './format-list'

const STATE_DIALOG: Record<string, Component> = {
  link: LinkMenu,
}

const MODIFIER_KEYS = {
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  shiftKey: false,
} as const

const MODIFIER = Object.keys(MODIFIER_KEYS) as (keyof typeof MODIFIER_KEYS)[]

const LINK_MODIFIER = isMac
  ? {
      ...MODIFIER_KEYS,
      metaKey: true,
    }
  : {
      ...MODIFIER_KEYS,
      ctrlKey: true,
    }

const SPECIAL_MENU = new Set(['image', 'gallery', 'embed', 'resource', 'horizontal_rule'])

function domFromEditorSelection(view: EditorView) {
  const { state } = view
  const { selection, schema } = state
  if (isNodeSelection(selection)) {
    return view.nodeDOM(selection.from)
  } else {
    // special handle embed node as it has child content
    const embed = findParentNodeOfType(schema.nodes.embed)(selection)
    if (embed) {
      return view.nodeDOM(embed.pos)
    }
  }
}

const Menu = defineComponent({
  components: {
    BubbleMenu,
    Icon,
  },

  props: {
    editor: {
      required: true,
      type: Object as PropType<Editor>,
    },
  },

  data: () => {
    return {
      selected: 'text',
      pendingSelected: null as string | null,
      isTransiting: false,
      state: null as string | null,
      inputComplete: null as null | DeferredPromise<string>,
      activeBlock: 'text',
      isActive: false,
      newFormats,
      nodeState: {
        bold: false,
        italic: false,
        underline: false,
        link: false,
        comment: false,
        image: 'regular',
      } as Record<string, any>,
    }
  },

  computed: {
    formats(): Format[] {
      return FORMAT[this.selected] || FORMAT.text
    },

    tippyOptions(): Partial<Props> {
      return {
        duration: [150, 0],
        arrow: false,
        interactive: true,
        onShown: this.handleShow,
        onHide: this.handleHide,
        onHidden: this.handleHidden,
        onMount(instance) {
          instance.popper.firstElementChild!.classList.add('transition-opacity', 'editor-menu-effect')
        },
      }
    },

    dialog(): Component | null {
      if (!this.state) {
        return null
      }
      return STATE_DIALOG[this.state]
    },
  },

  mounted(): void {
    document.addEventListener('keydown', this.handleHotKey)
    this.editor.on('selectionUpdate', this.handleSelectionUpdate)
    this.editor.on('update', this.handleSelectionUpdate)
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.handleHotKey)
    this.editor.off('selectionUpdate', this.handleSelectionUpdate)
    this.editor.off('update', this.handleSelectionUpdate)
  },

  methods: {
    isFormatActive(format: Format): boolean {
      if ('action' in format) {
        if (format.format === 'comment') {
          return this.editor.can().removeSelectComment()
        }
        if (!format.format) {
          return false
        }
        return this.editor.isActive(format.format, (format as ActionFormat).options) ?? false
      } else {
        const { selection } = this.editor.state
        if (!isNodeSelection(selection) || !format.isActive) {
          return false
        }
        return format.isActive(this.nodeState)
      }
    },

    async applyBlockFormat(format: ActionFormat) {
      const command = this.editor.chain().clearNodes()
      if (format.action !== 'clearNodes') {
        command[format.action](format.options as never)
      }
      command.run()
    },

    async applyFormat(format: Format) {
      if ('action' in format) {
        this.applyActionableFormat(format)
      } else {
        this.applyEventFormat(format)
      }
    },

    async applyActionableFormat(format: ActionableFormat): Promise<void> {
      const { commands } = this.editor

      const { action } = format
      const options = await this.resolveOptions(format)
      commands[action](options as never)
    },

    applyEventFormat(format: EventFormat) {
      const { view } = this.editor

      const dom = domFromEditorSelection(view)

      if (dom) {
        dom.dispatchEvent(new CustomEvent(format.event))
      }
    },

    async resolveOptions(format: ActionableFormat): Promise<object | undefined> {
      if ('state' in format) {
        const signal = pDefer<string>()
        this.inputComplete = signal
        this.state = format.state
        const input = await signal.promise
        return format.getOptions?.(input)
      }
      return format.options
    },

    handleShow() {
      document.body.classList.add('no-tooltip')
      this.isActive = true
    },

    handleHide(instance: Instance) {
      this.state = null
      this.inputComplete = null
      this.isTransiting = true
      document.body.classList.remove('no-tooltip')
      this.isActive = false
    },

    handleHidden() {
      this.isTransiting = false
      if (this.pendingSelected) {
        this.setSelected(this.pendingSelected)
        this.pendingSelected = null
      }
    },

    handleComplete(input: string) {
      this.inputComplete?.resolve(input)
    },

    setSelected(name: string) {
      if (this.isTransiting) {
        this.pendingSelected = name
        return
      }
      this.selected = SPECIAL_MENU.has(name) ? name : 'text'
    },

    handleHotKey(event: KeyboardEvent) {
      if (!this.isActive) {
        return
      }
      if (MODIFIER.some((modifier) => LINK_MODIFIER[modifier] !== event[modifier]) || event.key !== 'k') {
        return
      }
      event.preventDefault()
      this.applyFormat(linkFormat)
    },

    collectTextState() {
      const text: Record<string, boolean> = {}
      for (const format of Object.values(newFormats.text)) {
        if (!format.format) {
          continue
        }
        text[format.format] = this.isFormatActive(format)
      }

      text.comment = this.isFormatActive(newFormats.comment as Format)
      text.link = this.isFormatActive(newFormats.link as Format)
      this.nodeState = {
        ...this.nodeState,
        ...text,
      }
    },

    handleSelectionUpdate() {
      const { selection } = this.editor.state

      if (isNodeSelection(selection)) {
        const node = (selection as NodeSelection).node
        this.setSelected(node.type.name)
        if (node.type.name === 'image') {
          const { type } = this.editor.getAttributes(node.type)
          this.nodeState = {
            ...this.nodeState,
            image: type,
          }
        }
        return
      }

      const node = selection.$from.parent
      this.setSelected(node.type.name)
      if (this.selected === 'text') {
        this.collectTextState()
        for (const [key, format] of Object.entries(this.newFormats.textType)) {
          // because text is always enable and it's first one, so here can make sure only select the correct block
          if (this.isFormatActive(format)) {
            this.activeBlock = key
          }
        }
      }
    },
  },
})

export default Menu
</script>

<template>
  <BubbleMenu :editor="editor" :tippy-options="tippyOptions">
    <div class="tiptap-menu" @click.stop>
      <template v-if="selected === 'text'">
        <div class="format format-text">
          <div class="format-text-current">
            <template v-for="(format, key) in newFormats.textType">
              <span
                v-if="key === activeBlock"
                :key="key"
                class="whitespace-nowrap"
                style="color: rgb(76 76 76 / 70%)"
                v-text="format.name"
              />
            </template>
          </div>

          <span class="icon-chevron_down ml-[0.312rem] text-[0.5rem]" />

          <div class="wrapper">
            <div class="dropdown">
              <div class="dropdown-title">Turn Into</div>

              <div
                v-for="(format, key) in newFormats.textType"
                :key="key"
                class="format-text-type"
                :class="{ 'format-active': key === activeBlock }"
                role="button"
                @click="applyBlockFormat(format)"
              >
                <span class="icon" :class="format.icon" />

                <span class="action-name">{{ format.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="divider" />

        <div
          class="format format-link"
          :class="{ 'format-active': nodeState.link }"
          role="button"
          @click="applyFormat(newFormats.link)"
        >
          <component :is="newFormats.link.component" />
        </div>

        <div class="divider" />

        <div
          v-for="(format, key) in newFormats.text"
          :key="key"
          class="format"
          :class="[`format-${key}`, nodeState[format.format] && 'format-active']"
          role="button"
          @click="applyFormat(format)"
        >
          <span :class="format.icon" />
        </div>

        <div class="divider" />

        <div
          class="format format-comment"
          :class="{ 'format-active': nodeState.comment }"
          role="button"
          @click="applyFormat(newFormats.comment)"
        >
          <component :is="newFormats.comment.component" />
        </div>
      </template>

      <template v-else-if="selected === 'image'">
        <div
          v-for="(format, key) in newFormats.imageType"
          :key="key"
          class="format"
          :class="{ 'format-active': isFormatActive(format) }"
          role="button"
          @click="applyFormat(format)"
        >
          <span :class="format.icon" />
        </div>
      </template>

      <div
        v-for="format in formats"
        v-else
        :key="format.name"
        class="format"
        :class="[`format-${format.name.toLowerCase()}`, isFormatActive(format) && 'f-active']"
        role="button"
        @click="applyFormat(format)"
      >
        <span v-if="format.icon" class="icon" :class="format.icon" />
        <component :is="format.component" />
      </div>

      <component :is="dialog" v-if="dialog" style="top: 65px" @input="handleComplete" />
    </div>
  </BubbleMenu>
</template>

<style lang="scss" scoped>
.tiptap-menu {
  @apply flex;

  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 5px 2px rgb(0 0 0 / 10%);
  height: 2rem;

  .format {
    @apply transition-colors;
    @apply relative;
    @apply flex items-center justify-center;
    @apply cursor-pointer;

    color: #9f9f9f;
    min-width: 2rem;
    height: 100%;
    padding: 0.5rem 0.25rem;

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
  }

  .format-text,
  .format-link,
  .format-comment {
    color: #595959;
    padding-right: 0.625rem;
    padding-left: 0.625rem;
  }

  .format-text {
    @apply relative;

    &:hover .wrapper {
      @apply block;
    }

    .format-text-current {
      span:not(:last-of-type) {
        display: none;
      }
    }

    .wrapper {
      @apply hidden;
      @apply absolute top-full;
      @apply cursor-default;

      left: -1.5rem;

      .dropdown {
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 3px 6px 30px 2px rgb(0 0 0 / 15%);
        margin-top: 1px;
        padding-top: 5px;
        padding-bottom: 5px;

        .dropdown-title {
          color: rgb(61 61 61 / 40%);
          font-size: 0.625rem;
          font-weight: 700;
          line-height: 0.625rem;
          text-transform: uppercase;
          margin-bottom: 0.2rem;
          margin-left: 1rem;
          padding-top: 0.4rem;
        }

        .format-text-type {
          @apply flex items-center;
          @apply cursor-pointer;

          width: 100%;
          padding: 0.5rem 1rem;

          &:hover {
            background-color: #f0f0f0;
          }

          &.format-active {
            color: #7bc7f9;

            span {
              color: inherit;
            }
          }

          .icon {
            margin-right: 0.75rem;
          }

          .action-name {
            @apply whitespace-nowrap;

            color: #4c4c4c;
            font-size: 0.9rem;
            font-weight: 300;
            line-height: 100%;
          }
        }
      }
    }
  }

  .format-edit,
  .format-delete {
    width: 0.8rem;
  }

  .divider {
    background-color: rgb(0 0 0 / 15%);
    height: 100%;
    width: 1px;
  }
}
</style>
