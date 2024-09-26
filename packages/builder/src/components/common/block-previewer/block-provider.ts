import invariant from 'tiny-invariant'
import { defineComponent, provide, ref } from 'vue-demi'

import { createDataSource } from '~/lib/data-source'
import { createProvider } from './provider'

export const BlockProvider = defineComponent({
  props: {
    isolated: Boolean,
  },

  setup(props) {
    const element = createProvider(props.isolated ? createDataSource(ref(null)) : undefined)

    provide('$element', element)
  },

  render() {
    invariant(this.$slots.default)
    return this.$slots.default[0]
  },
})
