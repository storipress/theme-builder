import type { Component } from 'vue'
import { PREVIEW_MAP } from '@storipress/templates/other-pages'

function createImgElement(name: string, image: string): Component {
  return defineComponent({
    name: 'ImgPreview',

    render: (h) =>
      h('img', {
        attrs: {
          src: image,
          alt: name,
        },
      }),
  })
}

export const COMPONENTS = Object.keys(PREVIEW_MAP).map((name) => ({
  name,
  component: createImgElement(name, PREVIEW_MAP[name]),
}))
