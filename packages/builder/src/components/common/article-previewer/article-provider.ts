import type { StyleTree } from 'shared/code-generator/style-tree'
import { produce } from 'immer'
import { createStyleTree, mergeTree } from 'shared/code-generator/style-tree'
import invariant from 'tiny-invariant'
import { computed, defineComponent, provide, ref, watch } from 'vue-demi'
import { useActions, useMutations, useStore } from 'vuex-hooks'

import { ADD_COLOR, SET_TEMPLATE_STYLE } from '../../../store/modules/article/constants'
import { insertToTree } from '../../../store/utils'
import { normalizeStyles } from '../../../utils/style'
import { createProvider } from './provider'

const { freeze } = Object

export const ArticleProvider = defineComponent({
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
    const $store = useStore()
    const { [ADD_COLOR]: addColor, [SET_TEMPLATE_STYLE]: setTemplateStyle } = useMutations('article')
    const { setElementStyle } = useActions('article')

    const internalStyles = ref(freeze(createStyleTree('article')))

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

    const styles = computed((): StyleTree => {
      if (props.selectable) {
        return $store.getters['article/mergedTree']
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
      {
        immediate: true,
        deep: true,
      },
    )

    provide(
      '$element',
      createProvider({
        store: $store,
        selectable: props.selectable,
        elements: props.data?.elements,
        insertStyle: props.selectable ? insertToStore : insertToLocal,
        writeStyle: props.selectable ? writeStyle : insertToLocal,
        addColor: props.selectable
          ? addColor
          : ({ path, style }) => {
              insertToLocal(path, style)
            },
      }),
    )
  },

  render() {
    invariant(this.$slots.default)
    return this.$slots.default[0]
  },
})
