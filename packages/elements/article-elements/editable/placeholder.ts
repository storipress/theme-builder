import { isNil, omitBy } from 'lodash'
import { defineComponent, h, inject, onMounted } from 'vue-demi'

import { convertNameToPath } from '../../utils/article'
import { styleProps } from '../../utils/style-props'
import { INJECTED_DEFAULT } from '../inject'

export function createPlaceholder(name: string, kind: string) {
  return defineComponent({
    name,

    props: {
      ...styleProps,
    },

    setup(props) {
      const element = inject('$element', INJECTED_DEFAULT)

      onMounted(() => {
        element.registerElementDefault(convertNameToPath(kind), omitBy(props as any, isNil))
      })

      return () => h()
    },
  })
}
