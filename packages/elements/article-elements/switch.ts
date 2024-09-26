import type { Component } from 'vue'
import type { ArticleInjected } from './inject'

import Vue from 'vue'
import * as editable from './editable'
import * as stylable from './stylable'

type Components = keyof typeof editable

export function createSwitch(name: Components): Component {
  return Vue.extend({
    name,
    functional: true,

    inject: ['$element'],

    render(h, { props, injections, data, children }) {
      const $element: ArticleInjected = injections.$element
      const { attrs, class: className, domProps, nativeOn, on, staticStyle, staticClass, style } = data
      const component = $element.editable ? editable[name] : stylable[name]
      const propData = {
        props,
        attrs,
        class: className,
        staticClass,
        style,
        staticStyle,
        domProps,
        on,
        nativeOn,
      }

      return h(component, propData, children)
    },
  })
}
