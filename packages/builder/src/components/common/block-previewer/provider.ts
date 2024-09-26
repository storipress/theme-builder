import type { BlockInjected } from '@storipress/elements/block-elements'
import type { State as CommonState } from '../../../store/modules/common'
import type { State as FrontState } from '../../../store/modules/front'
import slugify from '@sindresorhus/slugify'
import { noop, sortBy } from 'lodash'
import { getStyleWithDefault } from 'shared/code-generator/style-tree'

import { computed, reactive, ref, watch } from 'vue-demi'
import { useActions, useMutations, useStore } from 'vuex-hooks'
import { dataSource as defaultDataSource } from '~/lib/data-source'
import type { DataSource } from '~/lib/data-source'
import { createImageURL, getPages, uploadLogo } from '../../../api'
import { useRoute } from '../../../lib/hooks'
import { useInsufficientArticleStore } from '../../../lib/insufficient-article'
import { pluckBreakpoint } from '../../../utils/style'

export function createProvider(dataSource: DataSource = defaultDataSource): BlockInjected {
  const store = useStore<{ common: CommonState; front: FrontState }>()
  const mutations = useMutations('front')
  const actions = useActions('front')
  const route = useRoute()
  const pages = ref<{ id: string; name: string; slug: string; url: string }[]>([])

  const { setArticleCount } = useInsufficientArticleStore()

  async function fetchPages() {
    if (!route.value.params.clientID) {
      return
    }
    const res = sortBy(await getPages(), ({ order }) => order)
    // FIXME: replace with vuex
    pages.value = res.map(({ id, title }) => {
      const slug = slugify(title)
      return {
        id,
        name: title,
        slug,
        url: `/${slug}`,
      }
    })
  }

  fetchPages()

  watch(
    () => route.value.params.clientID,
    (clientID?: string) => {
      if (clientID) {
        fetchPages()
      }
    },
  )

  // must be two step or TypeScript will fail to infer the type
  const res = reactive({
    scale: computed(() => store.state.common.scale),
    version: computed(() => store.state.front.version),
    logo: computed(() => store.getters['front/logo']),
    pages,
    desks: computed(() => {
      return sortBy(store.state.front.desks, ({ order }) => order).map(({ id, name, slug }) => ({
        id,
        name,
        slug,
        url: `/desks/${slug}/`,
      }))
    }),
    selectedElement: computed(() => store.state.front.selectedElement),
    hoveredElement: computed(() => store.state.front.hoveredElement),
    texts: computed(() => store.state.front.texts),
    images: computed(() => store.state.front.images),
    insertPoint: computed(() => store.state.front.insertPoint),
    blocks: computed(() => store.state.front.blocks),
    site: computed(() => store.state.common.site),
    blockStates: computed(() => store.state.front.blockStates as any),
    highlightedBlock: computed(() => store.state.front.highlightedBlock),
    selectedBlock: computed(() => store.getters['front/selectedBlock']),
    isPreview: store.getters.isPreview,
    isPreviewHtml: computed(() => store.state.front.isPreviewHtml),
    dataSource,

    async uploadImage(file: File) {
      const path = await uploadLogo(file)
      return createImageURL(path)
    },

    readStyle(path: readonly string[]) {
      return pluckBreakpoint(getStyleWithDefault(store.state.front.styles, path), store.getters.breakpoint)
    },
    addColor: noop,
    addDesk: mutations.ADD_DESK,
    setIsPreviewHtml: mutations.SET_IS_PREVIEW_HTML,
    setElementHover: mutations.SET_HOVERED_ELEMENT,
    setElementSelect: mutations.SET_SELECTED_ELEMENT,
    setElementStyle: actions.setElementStyle,
    setElementText: mutations.SET_ELEMENT_TEXT,
    setElementImage: mutations.SET_ELEMENT_IMAGE,
    setInsert: mutations.SET_INSERT,
    setSpacing: mutations.SET_SPACING,
    setSelectedBlock: mutations.SET_SELECTED_BLOCK,
    setImageSwapInfo: mutations.SET_IMAGE_SWAP_INFO,
    setArticleCount,
  })

  return res
}
