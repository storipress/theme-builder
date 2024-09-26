import type { VueConstructor } from 'vue'
import type Vue from 'vue'

import Imageify from '../../../common/imageify.vue'
import BlockTemplate from './block.vue'
import CenterTemplate from './center.vue'
import QuoteTemplate from './quote.vue'
import WideTemplate from './wide.vue'

function createTemplate(Component: VueConstructor<Vue>) {
  return defineComponent({
    render(h) {
      return h(Imageify, { props: { width: 500, height: 150 } }, [h(Component)])
    },
  })
}

export const SubscribeBlock = createTemplate(BlockTemplate)
export const SubscribeCenter = createTemplate(CenterTemplate)
export const SubscribeQuote = createTemplate(QuoteTemplate)
export const SubscribeWide = createTemplate(WideTemplate)
