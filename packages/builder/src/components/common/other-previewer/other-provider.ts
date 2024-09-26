import type { Editor } from '@tiptap/core'
import type { StyleTree } from 'shared/code-generator/style-tree'
import { configureBasicEditor } from '@storipress/editor-core'
import { produce } from 'immer'
import { createStyleTree, mergeTree } from 'shared/code-generator/style-tree'
import invariant from 'tiny-invariant'
import { computed, defineComponent, provide, ref, toRaw, watch } from 'vue-demi'
import { useActions, useGetters, useMutations, useState, useStore } from 'vuex-hooks'

import { insertToTree } from '../../../store/utils'
import { normalizeStyles } from '../../../utils/style'
import { createProvider } from './provider'

const { freeze } = Object

export const OtherProvider = defineComponent({
  props: {
    selectable: {
      type: Boolean,
      default: true,
    },

    data: {
      type: Object,
    },

    value: {
      type: Object,
    },
  },

  emits: ['input'],

  setup(props, { emit }) {
    const internalStyles = ref(freeze(createStyleTree('article')))
    const $store = useStore()
    const { editorContent } = useState('other')
    const { styleOptions } = useGetters('other')
    const {
      SET_EDITOR_CONTENT: setEditorContent,
      ADD_COLOR: addColor,
      SET_TEMPLATE_STYLE: setTemplateStyle,
    } = useMutations('other')
    const { setElementStyle } = useActions('other')

    const styles = computed((): StyleTree => {
      if (props.selectable) {
        return styleOptions.value
      }

      if (props.data?.styles) {
        return mergeTree(internalStyles.value, props.data.styles)
      }

      return internalStyles.value
    })

    watch(
      styles,
      (options) => {
        emit('input', options)
      },
      { immediate: true },
    )

    const editor = configureBasicEditor()
    editor.commands.setContent(toRaw(editorContent.value))

    editor.on('update', ({ editor }: { editor: Editor }) => {
      console.log('update', editor.getJSON())
      setEditorContent(editor.getJSON())
    })

    const insertToStore = (path: string[], style: Record<string, unknown>) => {
      setTemplateStyle({
        path,
        style,
        breakpoint: 'xs',
        skipHistory: true,
      })
    }

    const insertToLocal = (path: string[], style: Record<string, unknown>) => {
      const currentStyle = internalStyles.value
      const styles = normalizeStyles(style)

      internalStyles.value = produce(currentStyle, (draft) => {
        insertToTree(draft, path, styles, 'xs')
      })
    }

    const writeStyle = (path: string[], style: Record<string, unknown>) => {
      setElementStyle({
        path,
        style,
      })
    }

    provide(
      '$element',
      createProvider({
        store: $store,
        selectable: props.selectable,
        elements: props.data?.elements || {},
        insertStyle: props.selectable ? insertToStore : insertToLocal,
        writeStyle: props.selectable ? writeStyle : insertToLocal,
        addColor: props.selectable
          ? addColor
          : ({ path, style }) => {
              insertToLocal(path, style)
            },
        editor,
      }),
    )
  },

  render() {
    invariant(this.$slots.default)
    return this.$slots.default[0]
  },
})
