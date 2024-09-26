<script lang="ts">
import type { PropType } from 'vue-demi'
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue-demi'

import { convertNameToPath } from '../../utils/article'
import { useArticleElement } from '../inject'

interface Rect {
  left: number
  right: number
  top: number
  bottom: number
}

interface ElementDescriptor {
  kind: string
  rect: Rect
}

interface PseudoElement {
  ($el: Element, pos?: { x: number; y: number }): ElementDescriptor | undefined
}

export default defineComponent({
  props: {
    component: {
      type: String,
      required: true,
    },
    path: {
      type: Array as PropType<string[]>,
    },
    kind: {
      type: String,
      required: true,
    },
    display: {
      type: String,
    },
    styles: {
      type: Object,
      default: () => Object.freeze({}),
    },
    pseudoElements: {
      type: Array as () => PseudoElement[],
      default: () => [],
    },
  },

  setup(props) {
    const root = ref<HTMLElement>()
    const pseudo = ref<string | null>(null)
    const rect = ref<Rect | null>(null)

    const element = useArticleElement()

    function createStateGetter(state: 'hover' | 'selected', getKind: () => string | null) {
      return () => {
        const kind = getKind()
        return kind && element.value.selectable && element.value.section[state]?.name === kind
      }
    }

    const getPseudoName = () => pseudo.value
    const getKind = () => props.kind

    const isPseudoHover = computed(createStateGetter('hover', getPseudoName))
    const isPseudoSelected = computed(createStateGetter('selected', getPseudoName))
    const isHover = computed(createStateGetter('hover', getKind))
    const isSelected = computed(createStateGetter('selected', getKind))
    const computedPath = computed(() => {
      if (pseudo.value && (isPseudoHover.value || isPseudoSelected.value)) {
        return convertNameToPath(pseudo.value)
      }

      if (props.path) {
        return props.path
      }

      return convertNameToPath(props.kind)
    })

    const hasPseudoElement = computed(() => {
      return props.pseudoElements.length > 0
    })
    function findPseudoElement(event: MouseEvent): string | undefined {
      const res = runPseudoElementPredicates({ x: event.offsetX, y: event.offsetY })
      if (!res) {
        return
      }
      rect.value = res.rect
      pseudo.value = res.kind
      return res.kind
    }
    function runPseudoElementPredicates(pos: { x: number; y: number }): ElementDescriptor | undefined {
      for (const predicate of props.pseudoElements) {
        const descriptor = predicate(root.value as Element, pos)
        if (descriptor) {
          return descriptor
        }
      }
    }

    function setHover(event?: MouseEvent) {
      if (event) {
        const name = findPseudoElement(event)
        if (name) {
          return
        }
      }
      updateStore('hover', props.kind)
    }
    function updateSelected(event: MouseEvent) {
      const pseudo = findPseudoElement(event)
      if (pseudo) {
        return updateStore('selected', pseudo)
      }
      updateStore('selected', props.kind)
    }
    function clearHover() {
      updateStore('hover', null)
    }

    function updateStore(kind: 'selected' | 'hover', name: string | null) {
      if (!element.value.selectable) {
        return
      }

      const current = element.value.section[kind]?.name
      if (current === name) {
        return
      }
      const commit = kind === 'selected' ? element.value.setSectionSelect : element.value.setSectionHover
      commit(name ? { name, path: computedPath.value, display: props.display } : null)
    }

    onMounted(() => {
      element.value.registerElementDefault(props.path ?? convertNameToPath(props.kind), props.styles)

      watch(
        () => element.value.elements,
        async () => {
          if (props.pseudoElements.length === 0) {
            return
          }

          await nextTick()
          const foundPseudo = props.pseudoElements
            .map((fn) => fn(root.value as Element))
            .find((res) => pseudo.value && res?.kind === pseudo.value)
          if (foundPseudo) {
            rect.value = foundPseudo.rect
          }
        },
        { deep: true }
      )
    })

    return {
      root,
      pseudo,
      rect,
      isPseudoHover,
      isPseudoSelected,
      isHover,
      isSelected,
      boxStyle: computed(() => {
        const r = rect.value
        return r
          ? { left: `${r.left}px`, top: `${r.top}px`, width: `${r.right - r.left}px`, height: `${r.bottom - r.top}px` }
          : null
      }),
      hasPseudoElement,
      variants: computed(() => element.value.elements),
      listeners: computed(() => {
        return hasPseudoElement.value
          ? {
              mousemove: (event: MouseEvent) => {
                const name = findPseudoElement(event)
                if (name) {
                  updateStore('hover', name)
                } else {
                  setHover()
                }
              },
            }
          : undefined
      }),

      setHover,
      clearHover,
      updateSelected,
    }
  },
})
</script>

<template>
  <component
    :is="component"
    ref="root"
    class="relative"
    :class="[isHover && 'shadow-hover', isSelected && 'shadow-active']"
    @click.stop="updateSelected"
    @mouseover="setHover"
    @mouseout="clearHover"
    v-on="listeners"
  >
    <slot />
    <div
      v-if="hasPseudoElement && rect"
      class="absolute"
      :class="[isPseudoHover && 'shadow-hover', isPseudoSelected && 'shadow-active']"
      :style="boxStyle"
    />
  </component>
</template>
