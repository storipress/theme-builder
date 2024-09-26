<script lang="ts">
import type { Instance } from 'tippy.js'
import type { PropType } from 'vue-demi'
import { debounce, isEqual, isNil, last, omitBy } from 'lodash'
import { clickOutside } from 'shared/directives/click-outside'
import createTippy, { sticky } from 'tippy.js'
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue-demi'

import { setSelected, setStyle, store } from '../store'
import { styleProps } from './style-props'

const URL_REGEX = /^https?:\/\//
const urlFormatter = (url: string) => (URL_REGEX.test(url) ? url : `https://${url}`)

interface LinkInfo {
  start: number
  end: number
  href?: string
  pageId?: string
}

interface Position {
  top: string
  left: string
  width: string
  height: string
}

// @ts-expect-error no idea why overload not found
export default defineComponent({
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

    ...styleProps,
  },

  // eslint-disable-next-line sonarjs/cognitive-complexity
  setup(props) {
    const { path, display = '', defaultValue } = props as any

    const kind = computed(() => {
      const kind = last(path)
      if (!kind) {
        throw new Error('seem you forget to pass the `kind`')
      }
      return kind
    })

    const isSelected = () => {
      return isEqual(store.selected?.path, path)
    }

    const computedClass = computed(() => ({
      [kind.value as string]: true,
      'element-selected': isSelected,
      'element-has-error': store.hasErrors.some((p) => isEqual(p, path)),
    }))

    const content = ref(defaultValue ?? '')
    const links = ref([] as LinkInfo[])

    const pages = ref([
      { id: '1', name: 'About Us', url: '/about-us' },
      { id: '2', name: 'Privacy Policy', url: '/privacy-policy' },
    ])

    const contentHTML = computed(() => {
      if (links.value.every((item) => item.start === -1 || item.end === -1 || (!item.href && !item.pageId)))
        return content.value

      return links.value.reduceRight((html, item) => {
        const { start, end, href, pageId } = item
        if (start === -1 || end === -1 || (!href && !pageId)) return html

        const page = pages.value.find((p) => p.id === pageId)
        const url = page ? page.url : urlFormatter(href || '')

        const linkHTML = `<a href="${url}">${content.value.slice(start, end)}</a>`
        return html.slice(0, start) + linkHTML + html.slice(end)
      }, content.value)
    })

    const root = ref<HTMLElement | null>(null)
    const tippy = ref<HTMLElement | null>(null)
    const template = ref<HTMLElement | null>(null)

    const DEFAULT_POSITION = {
      top: '0px',
      left: '0px',
      width: '0px',
      height: '0px',
    } as Position

    const tippyPosition = ref({
      ...DEFAULT_POSITION,
    })

    let tippyInstance: Instance | null = null

    const tippyReset = () => {
      if (tippyInstance) {
        setTippyPosition(DEFAULT_POSITION)
      }
      linkMenuStep.value = 0
    }

    const DEFAULT_SELECTION = { start: -1, end: -1, range: null }

    const getSelectionCharacterOffsetWithin = () => {
      if (!root.value) return DEFAULT_SELECTION

      const win = root.value.ownerDocument.defaultView
      if (!win || !win.getSelection) return DEFAULT_SELECTION

      const selection = win.getSelection()
      if (!selection || selection.rangeCount <= 0) return DEFAULT_SELECTION

      const range = selection.getRangeAt(0)
      const preCaretRange = range.cloneRange()

      preCaretRange.selectNodeContents(root.value)

      preCaretRange.setEnd(range.startContainer, range.startOffset)
      const start = preCaretRange.toString().length
      preCaretRange.setEnd(range.endContainer, range.endOffset)
      const end = preCaretRange.toString().length

      return { start, end, range }
    }

    const selectionStartIndex = ref(-1)
    const selectionEndIndex = ref(-1)
    const overlappingLinkIdxs = computed(() => {
      const start = selectionStartIndex.value
      const end = selectionEndIndex.value

      if (start === -1 || end === -1) return []

      return links.value.reduce((result: number[], item: LinkInfo, i: number) => {
        if (!item.start || item.start === -1 || !item.end || item.end === -1) return result

        if (
          (start >= item.start && start <= item.end) ||
          (end >= item.start && end <= item.end) ||
          (start <= item.start && end >= item.end)
        ) {
          result.push(i)
        }
        return result
      }, [])
    })

    const currentTargetIdx = computed(() => overlappingLinkIdxs.value[0] ?? -1)

    const currentLink = computed(() => {
      const target = links.value[currentTargetIdx.value]

      if (!target || overlappingLinkIdxs.value.length > 1) return ''

      if (target.pageId) {
        const page = pages.value.find((p) => p.id === target.pageId)
        return page ? page.name : ''
      }

      if (target.href) {
        return target.href
      }

      return ''
    })

    const inputValue = ref('')

    const linkHandler = ({ pageId: newPageId = '', href: newHref = '' }: { pageId?: string; href?: string }) => {
      const rangeStart = selectionStartIndex.value
      const rangeEnd = selectionEndIndex.value

      if (rangeStart === rangeEnd) return false

      const newLink = {
        start: rangeStart,
        end: rangeEnd,
        href: newHref,
        pageId: newPageId,
      }

      if (currentTargetIdx.value > -1) {
        links.value.splice(currentTargetIdx.value, overlappingLinkIdxs.value.length, newLink)
      } else {
        links.value.push(newLink)
        links.value = links.value.sort((a, b) => a.start - b.start)
      }

      inputValue.value = ''
      tippyReset()
    }

    const A_TAG_REGEX = /<a href="(.*?)">(.*?)<\/a>/g
    const updateContent = () => {
      if (!root.value) return

      const textStr = root.value.textContent || ''
      const htmlStr = root.value.innerHTML

      const parseLinks = [...htmlStr.matchAll(A_TAG_REGEX)]
      if (parseLinks) {
        links.value = parseLinks
          .map((link) => {
            const [, href, text] = link || []
            const start = textStr.indexOf(text)
            const end = start + text.length

            const page = pages.value.find((p) => p.url === href)
            const pageId = page ? page.id : ''

            return {
              start,
              end,
              href,
              pageId,
            }
          })
          .sort((a, b) => a.start - b.start)
      }

      content.value = textStr
    }

    const removeLink = () => {
      links.value.splice(currentTargetIdx.value, 1)

      tippyReset()
    }

    const isShowNewLink = computed(() => currentLink.value.length === 0)
    const linkMenuStep = ref(0)

    const setTippyPosition = (position?: Position) => {
      // eslint-disable-next-line scanjs-rules/call_hide
      if (tippyInstance) tippyInstance.hide()
      if (position) tippyPosition.value = position

      const selection = getSelectionCharacterOffsetWithin()
      if (selection.start === selection.end || !selection.range || !template.value) return

      selectionStartIndex.value = selection.start
      selectionEndIndex.value = selection.end

      const { left, top, width, height } = selection.range.getBoundingClientRect()

      tippyPosition.value = {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
      }
    }

    const mouseupHandler = () => {
      setTippyPosition()

      linkMenuStep.value = 1
      if (tippyInstance) tippyInstance.show()
    }

    const blurHandler = () => {
      updateContent()
    }

    const debouncedUpdateContent = debounce(updateContent, 5000)
    const inputHandler = () => {
      debouncedUpdateContent()
      tippyReset()
    }

    const handleClickOutside = (event?: MouseEvent) => {
      if (!event || !event.target) {
        return
      }

      const $target = event.target as HTMLElement

      // check is not click on another element
      if ($target.closest('.element')) {
        return
      }

      if (!$target.closest('.tippy-box')) {
        tippyReset()
      }
    }

    const scrollHandler = () => {
      tippyReset()
    }

    const selectHandler = (event?: Event) => {
      if (store.shouldStop && event) {
        event.stopPropagation()
      }
      setSelected({ path, display })
    }

    onMounted(() => {
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
      } = props as any

      setStyle({
        path,
        data: omitBy(
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
        ),
      })

      tippyInstance = createTippy(tippy.value!, {
        content: template.value!,
        interactive: true,
        sticky: true,
        arrow: false,
        hideOnClick: false,
        delay: [150, 0],
        plugins: [sticky],
      })

      window.addEventListener('scroll', scrollHandler)
    })

    onBeforeUnmount(() => {
      if (tippyInstance) {
        tippyInstance.destroy()
      }

      window.removeEventListener('scroll', scrollHandler)
    })

    return {
      computedClass,
      contentHTML,
      linkMenuStep,
      tippyPosition,
      currentLink,
      pages,
      inputValue,
      isShowNewLink,

      // methods
      linkHandler,
      blurHandler,
      inputHandler,
      mouseupHandler,
      setSelected,
      handleClickOutside,
      selectHandler,
      removeLink,

      // DOM
      root,
      tippy,
      template,
    }
  },
})
</script>

<template>
  <div class="generic-link-element-wrapper" :class="computedClass">
    <component
      :is="component"
      ref="root"
      v-click-outside="handleClickOutside"
      class="element focus:outline-none"
      :contenteditable="editable"
      @blur="blurHandler"
      @input="inputHandler"
      @mouseup="mouseupHandler"
      @click="selectHandler"
      v-html="contentHTML"
    />
    <div ref="tippy" class="pointer-events-none fixed bg-gray-500 opacity-50" :style="tippyPosition" />
    <div
      ref="template"
      class="tippy-menu-wrapper shadow-1 flex rounded bg-white text-black"
      :class="[!linkMenuStep && 'hidden']"
    >
      <template v-if="linkMenuStep === 1">
        <div
          class="link-btn flex cursor-pointer items-center gap-1 rounded px-3 py-2 hover:bg-gray-100"
          @click="linkMenuStep = 2"
        >
          <template v-if="isShowNewLink">
            <i class="icon-link" />
            <span> Link </span>
          </template>
          <template v-else>
            <i class="icon-file_replace_outline" />
            <span class="w-40 truncate uppercase"> {{ currentLink }} </span>
          </template>
        </div>
        <div v-if="!isShowNewLink" class="cursor-pointer px-3 py-2 text-base" @click="removeLink">
          <i class="icon-delete" />
        </div>
      </template>
      <div v-if="linkMenuStep === 2" class="link-list cursor-pointer overflow-hidden rounded">
        <div
          v-for="page in pages"
          :key="page.id"
          class="w-40 px-3 py-2 uppercase hover:bg-gray-100"
          @click="linkHandler({ pageId: page.id })"
        >
          <span class="truncate"> {{ page.name }} </span>
        </div>
        <div>
          <input
            v-model="inputValue"
            class="w-40 px-3 py-2"
            placeholder="https://..."
            @keyup.enter="linkHandler({ href: inputValue })"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.generic-link-element-wrapper {
  > .element > a {
    @apply font-bold underline opacity-75;
  }

  > div[data-tippy-root] > .tippy-box {
    @apply font-lato text-base font-normal;
  }
}
</style>
