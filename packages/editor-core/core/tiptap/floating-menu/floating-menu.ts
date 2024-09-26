import type { PropType } from 'vue-demi'
import type { FloatingMenuPluginProps } from './floating-menu-plugin'
import { PluginKey } from 'prosemirror-state'

import { defineComponent } from 'vue-demi'
import { FloatingMenuPlugin } from './floating-menu-plugin'

const FloatingMenuKey = new PluginKey('floatingMenu')

export interface FloatingMenuInterface extends Vue {
  tippyOptions: FloatingMenuPluginProps['tippyOptions']
  editor: FloatingMenuPluginProps['editor']
}

export const FloatingMenu = defineComponent({
  name: 'FloatingMenu',

  props: {
    editor: {
      type: Object as PropType<FloatingMenuPluginProps['editor']>,
      required: true,
    },

    tippyOptions: {
      type: Object as PropType<FloatingMenuPluginProps['tippyOptions']>,
      default: () => ({}),
    },
  },

  watch: {
    editor: {
      immediate: true,
      handler(editor: FloatingMenuPluginProps['editor']) {
        if (!editor) {
          return
        }

        this.$nextTick(() => {
          editor.registerPlugin(
            FloatingMenuPlugin({
              pluginKey: FloatingMenuKey,
              editor,
              element: this.$el as HTMLElement,
              tippyOptions: this.tippyOptions,
              shouldShow: null,
            })
          )
        })
      },
    },
  },

  beforeUnmount() {
    this.editor.unregisterPlugin(FloatingMenuKey)
  },

  render(createElement) {
    return createElement('div', { style: { visibility: 'hidden' } }, this.$slots.default)
  },
})
