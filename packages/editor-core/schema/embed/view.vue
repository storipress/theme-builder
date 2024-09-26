<script lang="ts">
import type CodeMirror from 'codemirror'
import type { Node } from 'prosemirror-model'
import type { PropType } from 'vue-demi'
import { purify } from '@storipress/tiptap-schema'
import { NodeViewContent, NodeViewWrapper } from '@tiptap/vue-2'
import { exitCode } from 'prosemirror-commands'
import { Selection, TextSelection } from 'prosemirror-state'
import { computed, defineComponent, onMounted, ref, watch } from 'vue-demi'

import Preview from './preview.vue'
import { sandboxIFrame } from './sandbox-iframe'

function computeChange(oldVal: string, newVal: string) {
  if (oldVal === newVal) return null
  let start = 0
  let oldEnd = oldVal.length
  let newEnd = newVal.length
  while (start < oldEnd && oldVal.charCodeAt(start) === newVal.charCodeAt(start)) ++start
  while (oldEnd > start && newEnd > start && oldVal.charCodeAt(oldEnd - 1) === newVal.charCodeAt(newEnd - 1)) {
    oldEnd--
    newEnd--
  }
  return { from: start, to: oldEnd, text: newVal.slice(start, newEnd) }
}

const renderer = {
  html(content: string) {
    const node = purify(content, true)
    sandboxIFrame(node)
    return node.innerHTML
  },
}

export default defineComponent({
  name: 'EmbedView',

  components: { NodeViewWrapper, NodeViewContent, Preview },

  props: {
    editor: {
      type: Object as PropType<import('@tiptap/core').Editor>,
      required: true,
    },
    node: {
      type: Object as PropType<Node<any>>,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
    extension: {
      type: Object as PropType<import('@tiptap/core').Node<any>>,
      required: true,
    },
    getPos: {
      type: Function as PropType<() => number>,
      required: true,
    },
    updateAttributes: {
      type: Function as PropType<(attributes: Record<string, any>) => void>,
      required: true,
    },
    deleteNode: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },

  setup(props) {
    let CM: typeof CodeMirror
    let cm: CodeMirror.Editor
    let updating = false
    let incomingChanges = false

    const target = ref<HTMLTextAreaElement>()
    const editing = ref(true)

    const content = computed(() => props.node.textContent)
    const previewContent = computed(() => renderer.html(content.value))

    function forwardSelection() {
      if (!cm.hasFocus()) return
      const state = props.editor.state
      const selection = asProseMirrorSelection(state.doc)
      if (!selection.eq(state.selection)) props.editor.view.dispatch(state.tr.setSelection(selection))
    }
    function asProseMirrorSelection(doc: Node) {
      const offset = props.getPos() + 1
      const anchor = cm.indexFromPos(cm.getCursor('anchor')) + offset
      const head = cm.indexFromPos(cm.getCursor('head')) + offset
      return TextSelection.create(doc, anchor, head)
    }
    function codeMirrorKeymap(): CodeMirror.KeyMap {
      const { view, commands } = props.editor
      return {
        Up: () => maybeEscape('line', -1),
        Left: () => maybeEscape('char', -1),
        Down: () => maybeEscape('line', 1),
        Right: () => maybeEscape('char', 1),
        'Ctrl-Z': () => void commands.undo(),
        'Shift-Ctrl-Z': () => void commands.redo(),
        'Ctrl-Y': () => void commands.redo(),
        'Ctrl-Enter': () => {
          if (exitCode(view.state, view.dispatch)) view.focus()
        },
      }
    }
    function maybeEscape(unit: 'line' | 'char', dir: number) {
      const pos = cm.getCursor()
      if (
        cm.somethingSelected() ||
        pos.line !== (dir < 0 ? cm.firstLine() : cm.lastLine()) ||
        (unit === 'char' && pos.ch !== (dir < 0 ? 0 : cm.getLine(pos.line).length))
      ) {
        return CM.Pass
      }
      props.editor.view.focus()
      const targetPos = props.getPos() + (dir < 0 ? 0 : props.node.nodeSize)
      const selection = Selection.near(props.editor.view.state.doc.resolve(targetPos), dir)
      props.editor.view.dispatch(props.editor.view.state.tr.setSelection(selection).scrollIntoView())
      props.editor.view.focus()
    }
    function valueChanged() {
      const change = computeChange(content.value, cm.getValue())
      const schema = props.editor.view.state.schema
      if (change) {
        const start = props.getPos() + 1
        const tr = props.editor.view.state.tr.replaceWith(
          start + change.from,
          start + change.to,
          change.text ? schema.text(change.text) : null
        )
        props.editor.view.dispatch(tr)
      }
    }

    watch(content, (value, old) => {
      if (value === old) {
        return
      }

      const change = computeChange(cm.getValue(), value)
      if (change) {
        updating = true
        cm.replaceRange(change.text, cm.posFromIndex(change.from), cm.posFromIndex(change.to))
        updating = false
      }
    })

    watch(editing, (value) => {
      if (!cm) {
        return
      }

      if (value) {
        cm.focus()
      }
      cm.setOption('readOnly', !value)
    })

    watch(
      () => props.selected,
      (value) => {
        if (value && cm) {
          cm.focus()
        }
      }
    )

    onMounted(async () => {
      const { CodeMirror } = await import('./codemirror')
      CM = CodeMirror
      cm = CodeMirror.fromTextArea(target.value as HTMLTextAreaElement, {
        mode: 'htmlmixed',
        value: content.value,
        extraKeys: codeMirrorKeymap(),
      })

      cm.on('blur', () => {
        if (!content.value) {
          const pos = props.getPos()
          const node = props.editor.view.state.doc.nodeAt(pos)
          props.editor.view.dispatch(props.editor.view.state.tr.deleteRange(pos, pos + node!.nodeSize))
          return
        }

        editing.value = false
      })

      cm.on('beforeChange', () => (incomingChanges = true))
      // Propagate updates from the code editor to ProseMirror
      cm.on('cursorActivity', () => {
        if (!updating && !incomingChanges) forwardSelection()
      })
      cm.on('changes', () => {
        if (!updating) {
          valueChanged()
          forwardSelection()
        }
        incomingChanges = false
      })
      cm.on('focus', () => forwardSelection())
    })

    return {
      target,
      editing,

      name: computed(() => props.node.attrs.name),
      content,
      previewContent,
      selectNode() {
        const { commands } = props.editor
        commands.setNodeSelection(props.getPos())
      },
    }
  },
})
</script>

<template>
  <NodeViewWrapper
    class="embed interactive-node clear-both"
    :class="selected && 'has-focus'"
    data-format="embed"
    contenteditable="false"
    :data-name="name"
    :data-content="content"
    @edit-mode.native="editing = true"
  >
    <span class="absolute left-0 h-8 w-8 -translate-x-full transform">
      <span class="icon-html_embed" style="font-size: 20px; color: #9baeb8" />
    </span>

    <div class="relative">
      <div :class="!editing && 'hidden'">
        <textarea ref="target" :value="content" />
      </div>

      <Preview :class="editing && 'hidden'" :html="previewContent" />

      <div class="absolute inset-0 z-10" :class="{ hidden: editing }" @click="selectNode" />
    </div>

    <!-- ProseMirror slot, this is required or ProseMirror will change the whole element into editable -->
    <NodeViewContent class="hidden" />
  </NodeViewWrapper>
</template>

<style scoped lang="scss">
$icon-size: 24px;

.embed {
  @apply p-px;
}

.markdown-toolbar {
  button {
    height: $icon-size;
    width: $icon-size;
  }
}
</style>
