import invariant from 'tiny-invariant'
import { defineComponent, provide } from 'vue-demi'

export const BlockIdProvider = defineComponent({
  props: {
    blockId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    provide('blockId', props.blockId)
  },

  render() {
    invariant(this.$slots.default)
    return this.$slots.default[0]
  },
})
