import type { ArticleInjected } from '@storipress/elements/article-elements'
import type { Store } from 'vuex'
import type { State as ArticleState } from '../../../store/modules/article'
import type { State as CommonState } from '../../../store/modules/common'
import { constant, noop } from 'lodash'
import { getStyleWithDefault } from 'shared/code-generator/style-tree'

import { reactive, ref } from 'vue-demi'
import { useGetters, useMutations, useState } from 'vuex-hooks'
import { SET_SECTION_HOVER, SET_SECTION_SELECT } from '../../../store/modules/article/constants'
import { pluckBreakpoint } from '../../../utils/style'

interface ProviderOptions {
  store: Store<any>
  selectable: boolean
  elements?: { dropcap: string; blockquote: string }
  insertStyle: (path: string[], style: Record<string, unknown>) => void
  writeStyle: (path: string[], style: Record<string, unknown>) => void
  addColor: (info: { path: string[]; style: Record<string, unknown> }) => void
}

const article = {
  desk: 'World News',
  title: 'Article title (H1)',
  description:
    'Your article description. Change my styling by clicking on me and using the text styling toolbar on the top left.',
  author: 'Helga Smith',
  caption: 'This is the font styling for your headline caption',
}

export interface SetData {
  path: string[]
  data: Record<string, unknown>
  skipHistory?: boolean
  breakpoint?: string
}

export function createProvider({
  store,
  selectable,
  elements: staticElements,
  insertStyle,
  writeStyle,
  addColor,
}: ProviderOptions): ArticleInjected {
  const { section, elements } = useState<ArticleState>('article')

  const { logo } = useGetters<{ logo: string }>('front')
  const { site, scale } = useState<CommonState>('common')
  const mutations = useMutations('article')

  return reactive({
    selectable,
    editable: false,
    scale,
    logo,

    desk: article.desk,
    title: article.title,
    blurb: article.description,
    authors: [{ name: article.author, url: '#' }],
    date: new Date(),
    headlineURL: 'https://picsum.photos/800/600',
    headlineFocus: { x: 0, y: 0 },
    headlineAlt: '',
    headlineCaption: article.caption,
    site,

    section,
    elements: staticElements ? ref(staticElements) : elements,

    bus: {} as any,
    editor: {},
    profile: {},

    readStyle(path: readonly string[]) {
      return pluckBreakpoint(getStyleWithDefault(store.getters['article/mergedTree'], path), store.getters.breakpoint)
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

    createImageURL: noop as any,
    uploadImage: constant(Promise.resolve()) as any,
    setSectionHover: mutations[SET_SECTION_HOVER],
    setSectionSelect: mutations[SET_SECTION_SELECT],
  })
}
