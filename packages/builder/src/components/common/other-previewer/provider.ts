import type { ArticleInjected } from '@storipress/elements/article-elements'
import type { Editor } from '@tiptap/core'
import type { Ref } from 'vue-demi'
import type { Store } from 'vuex'
import type { State as CommonState } from '../../../store/modules/common'
import type { State as OtherState } from '../../../store/modules/other'
import { Evt } from 'evt'
import { getStyleWithDefault } from 'shared/code-generator/style-tree'

import { computed, reactive, ref, unref } from 'vue-demi'
import { useMutations, useState } from 'vuex-hooks'
import { createImageURL, uploadOtherImage } from '../../../api'
import { SET_SECTION_HOVER, SET_SECTION_SELECT, SET_TEMPLATE_DATA } from '../../../store/modules/other/constants'
import { pluckBreakpoint } from '../../../utils/style'

interface ProviderOptions {
  store: Store<any>
  selectable: boolean
  elements?: { dropcap: string; blockquote: string }
  insertStyle: (path: string[], style: Record<string, unknown>) => void
  writeStyle: (path: string[], style: Record<string, unknown>) => void
  addColor: (info: { path: string[]; style: Record<string, unknown> }) => void
  editor: Editor
}

export interface SetData {
  path: string[]
  data: Record<string, unknown>
  skipHistory?: boolean
  breakpoint?: string
}

const DEFAULT_CONTENT = {
  desk: '',
  title: "This is your other page's title",
  description:
    "And this is your other page's description. Customise any text type you see here by clicking on me and navigating to the context menu on the top left.",
  headlineURL: 'https://picsum.photos/800/600',
  headlineAlt: '',
  author: 'Helga Smith',
  caption: 'This is the font styling for your headline caption',
}

export function createProvider({
  store,
  selectable,
  elements: staticElements,
  insertStyle,
  writeStyle,
  addColor,
  editor,
}: ProviderOptions): ArticleInjected {
  const { section, elements, templateData, id } = useState<OtherState>('other')
  const { site, scale } = useState<CommonState>('common')
  const mutations = useMutations('other')

  function createTemplateDataRef(key: keyof typeof templateData.value, defaultValue: string | Ref<string> = '') {
    return computed({
      get: (): string => (templateData.value[key] ?? DEFAULT_CONTENT[key]) || unref(defaultValue) || '',
      set: (value: string) => {
        mutations[SET_TEMPLATE_DATA]({
          key,
          value,
        })
      },
    })
  }
  const title = createTemplateDataRef('title')
  const description = createTemplateDataRef('description')
  const caption = createTemplateDataRef('caption')
  const headlineURL = createTemplateDataRef(
    'headlineURL',
    computed(() => (store.state.other.mode === 'edit' ? '' : DEFAULT_CONTENT.headlineURL)),
  )
  const headlineAlt = createTemplateDataRef('headlineAlt')

  return reactive({
    selectable,
    editable: store.state.other.mode === 'edit',
    scale,

    site,
    desk: '',
    logo: '',
    title,
    blurb: description,
    authors: [{ name: DEFAULT_CONTENT.author, url: '#' }],
    date: new Date(),
    headline: headlineURL,
    headlineURL,
    headlineFocus: { x: 0, y: 0 },
    headlineAlt,
    headlineCaption: caption,

    section,
    elements: staticElements ? ref(staticElements) : elements,

    bus: Evt.create() as any,
    editor,
    profile: {},

    readStyle(path: readonly string[]) {
      return pluckBreakpoint(getStyleWithDefault(store.getters['other/mergedTree'], path), store.getters.breakpoint)
    },
    setElementStyle({ path, data, skipHistory }: SetData) {
      if (skipHistory) {
        return insertStyle(path, data)
      }

      writeStyle(path, data)
    },
    registerElementDefault(path: string[], style: Record<string, unknown>) {
      insertStyle(path, style)
    },
    addColor,

    createImageURL,
    uploadImage: (file: File) => {
      return uploadOtherImage(id.value, file)
    },
    setSectionHover: mutations[SET_SECTION_HOVER],
    setSectionSelect: mutations[SET_SECTION_SELECT],
  })
}
