<script lang="ts">
import type { PropType } from 'vue-demi'
import type { ElementInfo } from './base-element'
import { isEqual, isNil, omitBy } from 'lodash'
import { clickOutside } from 'shared/directives/click-outside'
import invariant from 'tiny-invariant'
import tippy from 'tippy.js'

import { computed, defineComponent, onMounted, ref, toRef } from 'vue-demi'
import AutoSizeInput from '../common/auto-size-input.vue'
import { useElement } from './base-element'
import { usePath } from './use-path'

function matchElement(actual: ElementInfo, expect?: ElementInfo | null): boolean {
  if (!expect) {
    return false
  }

  if (expect.path.length === 0) {
    return false
  }

  invariant(actual.path.length > 0, 'no actual path')

  return isEqual(actual.path, expect.path)
}

export default defineComponent({
  components: { AutoSizeInput },

  directives: { clickOutside },

  props: {
    component: String,
    display: String,
    path: {
      type: Array as PropType<string[]>,
      required: true,
    },
    editable: { type: Boolean, default: undefined },
    defaultValue: String,

    fontSize: [Number, Object],
    fontFamily: [String, Object],
    bold: { type: [Boolean, Object], default: undefined },
    italic: { type: [Boolean, Object], default: undefined },
    underline: { type: [Boolean, Object], default: undefined },
    uppercase: { type: [Boolean, Object], default: undefined },
    lowercase: { type: [Boolean, Object], default: undefined },
    align: [String, Object],
    color: [String, Object],
    lineHeight: [Number, Object],
    hoverColor: [String, Object],
  },

  // eslint-disable-next-line sonarjs/cognitive-complexity
  setup(props, { slots }) {
    const element = useElement()
    const { path, kind, stylePath } = usePath(toRef(props, 'path'))

    const computedClass = computed(() => {
      if (element.value.insertPoint) {
        // disable highlight when inserting
        return [kind.value]
      }

      const selfInfo = { path: stylePath.value }
      const hover = matchElement(selfInfo, element.value.hoveredElement)
      const selected = matchElement(selfInfo, element.value.selectedElement)

      return [kind.value, hover && 'shadow-hover', selected && 'shadow-active']
    })

    const computedValue = computed(() => {
      // FIXME: fix type
      // @ts-expect-error fixme
      const value = path.value.reduce((obj, key) => obj?.[key], element.value.texts)

      return value ?? ''
    })

    const componentRef = ref<HTMLElement>()
    const containerRef = ref<HTMLElement>()
    const buttonRef = ref<HTMLElement>()
    const targetRef = computed(() => {
      return slots.default ? containerRef.value : componentRef.value
    })
    function setupTippy() {
      tippy(targetRef.value as HTMLElement, {
        content: buttonRef.value as HTMLElement,
        appendTo: componentRef.value?.parentElement!,
        duration: 150,
        arrow: false,
        hideOnClick: 'toggle',
        interactive: true,
        placement: 'right-start',
        popperOptions: {
          modifiers: [
            {
              name: 'flip',
              options: {
                fallbackPlacements: ['right', 'right-end'],
              },
            },
          ],
        },
      })
    }

    onMounted(() => {
      setupTippy()

      const {
        align,
        bold,
        color,
        fontFamily,
        fontSize,
        italic,
        lineHeight,
        lowercase,
        underline,
        uppercase,
        hoverColor,
      } = props

      const data = omitBy(
        {
          align,
          bold,
          color,
          fontFamily,
          fontSize,
          italic,
          lineHeight,
          lowercase,
          underline,
          uppercase,
          hoverColor,
        },
        isNil
      )

      if (Object.keys(data).length === 0) {
        return
      }

      element.value.setElementStyle({
        path: stylePath.value,
        breakpoint: 'xs',
        skipHistory: true,
        data,
      })
    })

    if (props.defaultValue != null) {
      element.value.setElementText({ path: path.value, data: props.defaultValue, noOverride: true, skipHistory: true })
    }

    return {
      componentRef,
      containerRef,
      buttonRef,

      computedClass,
      computedValue,

      setHover() {
        if (element.value.insertPoint) {
          return
        }

        element.value.setElementHover({
          path: stylePath.value,
        })
      },

      clearHover() {
        element.value.setElementHover(null)
      },

      setSelected() {
        if (element.value.insertPoint) {
          return
        }

        element.value.setElementSelect({
          path: stylePath.value,
        })
      },

      handleClickOutside(event?: MouseEvent) {
        if (!event) {
          element.value.setElementSelect(null)
          return
        }

        if (!event.target) {
          return
        }

        const $target = event.target as HTMLElement

        // check is not click on another element
        if ($target.closest('.element')) {
          return
        }

        element.value.setElementSelect(null)
      },

      handleInput(val: string) {
        element.value.setElementText({
          path: path.value,
          data: val,
        })
      },
    }
  },
})
</script>

<template>
  <AutoSizeInput
    v-if="editable"
    v-click-outside="handleClickOutside"
    type="textarea"
    class="element"
    :class="computedClass"
    :value="computedValue"
    @input="handleInput"
    @mouseover="setHover"
    @mouseout="clearHover"
    @click="setSelected"
  />
  <component
    :is="component"
    v-else
    ref="componentRef"
    v-click-outside="handleClickOutside"
    class="element"
    :class="computedClass"
    @mouseover="setHover"
    @mouseout="clearHover"
    @click="setSelected"
  >
    <div ref="containerRef" class="generic-slot">
      <slot />
    </div>
    <button
      ref="buttonRef"
      class="shadow-1 hover:bg-white-grey active:shadow-2 absolute -right-4 -top-4 z-[9999] h-8 w-8 select-none items-center justify-center rounded bg-white text-center text-black"
      @click.stop="setSelected"
      @mouseover="setHover"
      @mouseout="clearHover"
    >
      <i class="icon-pencil" />
    </button>
  </component>
</template>
