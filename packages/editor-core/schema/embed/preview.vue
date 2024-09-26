<script lang="ts">
import { render } from 'eta'
import { nanoid } from 'nanoid'
import { computed, defineComponent, onMounted, reactive, ref } from 'vue-demi'

import previewTemplate from './preview-iframe.html.eta'

export default defineComponent({
  props: {
    html: {
      type: String,
      default: '',
    },
  },

  setup(props) {
    const root = ref<HTMLElement>()
    const id = nanoid()
    const preview = computed(() => render(previewTemplate, { html: props.html, id }))
    const style = reactive({
      width: '100%',
      height: '300px',
    })

    onMounted(() => {
      const $root = root.value as any
      $root._iframeResize = (rect: DOMRect) => {
        style.height = `${rect.height}px`
      }
    })

    return {
      root,
      id: `preview-${id}`,
      preview,
      style,
    }
  },
})
</script>

<template>
  <div :id="id" ref="root" :style="style">
    <iframe
      :srcdoc="preview"
      width="100%"
      height="100%"
      sandbox="
          allow-forms
          allow-popups
          allow-popups-to-escape-sandbox
          allow-same-origin
          allow-scripts
        "
    />
  </div>
</template>
