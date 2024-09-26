<script lang="ts">
import type { EditableSEO } from 'shared/types'
import type { Page } from '../../../../api'
import { mdiArrowLeft, mdiCogOutline, mdiPlus } from '@mdi/js'
import { cloneDeep, noop } from 'lodash'
import Icon from 'shared/components/icon.vue'

import { defineComponent } from 'vue-demi'
import { createPage, deletePage, getPages, updatePage } from '../../../../api'
import { frontHelpers } from '../../../../store/modules/front'
import { useConfirmSave } from './confirm-save'
import SidepaneMenu from './copy-menu.vue'
import UnsavedDialog from './unsaved-change/unsaved-dialog.vue'

interface SEO {
  titleTag: string
  urlSlug: string
  meta: string
  titleOg: string
  descriptionOg: string
  imgurl: string
  isMatched: boolean
  headcode: string
  bodycode: string
}

interface CurrentPage {
  path: string
  id: string
  name?: string
  seo?: SEO
}

const DEFAULT_SEO: Required<EditableSEO> = {
  slug: 'new-page',
  meta: {
    matched: true,
    title: 'Untitled',
    description: 'Describe your page. Optimal description length is 155 to 300 characters.',
  },
  og: {
    matched: true,
    title: 'Untitled',
    description: 'Describe your page. Optimal description length is 155 to 300 characters.',
  },

  ogImage: '',
  inject: {
    header: '<!-- write some code for the head -->',
    footer: '<!-- write some code for the body -->',
  },
}

const DESK_PAGE = 'Desk Pages'

const DEFAULT_LIST = [
  { isDesk: false, name: 'Front Page', id: 'front' },
  { isDesk: true, name: DESK_PAGE, id: 'desk' },
  { isDesk: false, name: 'Article Designs', id: 'article' },
]

// TODO: refactor template
export default defineComponent({
  components: { Icon, SidepaneMenu, UnsavedDialog },
  props: ['deletesignal', 'defaultPage'],
  setup() {
    const confirmSave = useConfirmSave()

    return {
      confirmSave,
    }
  },
  data() {
    const defaultCurrentId = this.defaultPage.id
    const defauleSettingName = DEFAULT_LIST.find((item) => item.id === defaultCurrentId)?.name || 'Front Page'
    return {
      settingName: defauleSettingName,
      isDeskpages: false,
      mdiArrowLeft,
      mdiPlus,
      mdiCogOutline,
      defaultlist: DEFAULT_LIST,
      disable: null as null | number,
      currentIndex: null as null | number,
      desklists: [],
      newOtherPages: false,
      defaultpage: { title: 'Untitled' },
      otherPages: [] as Page[],
      currentId: defaultCurrentId, // clickedId,
      currentPage: this.defaultPage as CurrentPage,
    }
  },
  watch: {
    deletesignal() {
      // TODO: invert dependency
      if (this.deletesignal) {
        this.deletePagehandler()
      }
    },
  },
  async created() {
    try {
      this.getOtherPage()
    } catch {
      // TODO: error flow via globel error handler
    }
  },
  computed: {
    ...frontHelpers.mapState({
      desks: 'desks',
      sitedata: 'site',
    }),
  },
  methods: {
    async getOtherPage() {
      const PAGE_ARR = await getPages()
      this.otherPages = cloneDeep(PAGE_ARR)
    },
    async newPagehandler() {
      await createPage(this.defaultpage.title, { ...DEFAULT_SEO })

      this.getOtherPage()
      const list = this.otherPages[0]
      if (list) {
        this.handleSetting(list.title, false, 0)
        this.onClickPage({ path: 'Page', id: list.id, name: list.title, seo: list.seo })
      }
      this.newOtherPages = false
      this.defaultpage = { title: 'Untitled' }
    },
    async clonePagehandler() {
      await createPage(`${this.currentPage.name} copy`, { ...this.currentPage.seo })
      this.getOtherPage()
    },
    async editPagehandler(id: string, title: string) {
      await updatePage({
        id,
        title,
      })
      this.disable = null
      this.getOtherPage()
      this.settingName = title
    },
    async deletePagehandler() {
      await deletePage(this.currentId)

      this.getOtherPage()
      const firstPage = this.otherPages[0]
      if (firstPage) {
        this.handleSetting(firstPage.title, false, 0)
        this.onClickPage({ path: 'Page', id: firstPage.id, name: firstPage.title, seo: firstPage.seo })
      }
    },
    async handleSetting(name: string, isDesk: boolean, index: number | null = null) {
      this.isDeskpages = isDesk
      this.currentIndex = index
      if (name === DESK_PAGE) {
        await this.listDesks()
      }
      this.settingName = name === DESK_PAGE ? this.desks[0].name : name
    },
    async onClickPage(value: CurrentPage) {
      await this.confirmSave()
      if (value.path === 'front' || value.path === 'Desk') {
        this.$router.replace({ name: 'front-page', params: { clientID: this.$route.params.clientID } }).catch(noop)
      }

      if (value.path === 'Page') {
        this.currentPage = value
        this.$router
          .replace({ name: 'other', params: { clientID: this.$route.params.clientID, oid: value.id } })
          .catch(noop)
      }

      this.currentId = value.id === 'desk' ? this.desks[0].id : value.id
      this.$emit('clicked', value)
    },
    menuClicked(value: string) {
      switch (value) {
        case 'rename':
          this.disable = this.currentIndex
          break

        case 'duplicate':
          this.clonePagehandler()
          break

        case 'delete':
        // this.deletePagehandler()
      }
      this.$emit('action-handler', { action: value, id: this.currentId, name: this.settingName })
    },
    earseDisable() {
      if (this.currentIndex !== this.disable) this.disable = null
    },
    ...frontHelpers.mapActions({
      listDesks: 'listDesks',
    }),
  },
})
</script>

<template>
  <!-- add overflow-visible to fix this bug https://storipress-media.atlassian.net/jira/software/projects/SPMVP/boards/1?selectedIssue=SPMVP-2882 -->
  <div class="scrollbar-hide custom-overflow block h-auto min-h-full shadow">
    <div class="block w-full py-4 pl-6 pr-2">
      <h2 class="text-brownish-grey text-base font-light">
        {{ isDeskpages ? 'Page Mgmt  > Desk Pages' : 'Page Management' }}
      </h2>
      <h1 class="text-almost-black text-2xl">{{ settingName || 'Front Page' }}</h1>
    </div>
    <div>
      <transition name="deskpage-show">
        <div v-if="isDeskpages" class="mb-4 mt-1 flex w-full flex-col">
          <template v-for="(desk, index) of desks">
            <div
              :key="index"
              class="text-brownish-grey grow cursor-pointer py-2.5 pl-6 pr-2 text-base"
              :class="currentId === desk.id && 'active-sidepane'"
              @click="
                handleSetting(desk.name, true)
                onClickPage({ path: 'desk', id: desk.id, name: desk.name })
              "
            >
              {{ desk.name }}
            </div>
          </template>
        </div>
      </transition>
      <transition name="fade-top">
        <div v-if="!isDeskpages" class="mb-4 mt-1 flex w-full flex-col">
          <template v-for="(list, index) of defaultlist">
            <div
              :key="index"
              class="text-brownish-grey grow cursor-pointer py-2.5 pl-6 pr-2 text-base"
              :class="currentId === list.id && 'active-sidepane'"
              @click="
                handleSetting(list.name, list.isDesk)
                onClickPage({ path: list.id, id: list.id })
              "
            >
              {{ list.name }}
            </div>
          </template>
        </div>
      </transition>
      <!-- </div> -->
      <transition name="fade">
        <div v-if="!isDeskpages" class="flex w-full grow flex-col">
          <template v-for="(list, index) of otherPages" class="flex flex-row">
            <div
              :key="index"
              class="text-brownish-grey felx group flex-row pb-0.5 pl-6 pr-0 pt-1 text-base hover:cursor-pointer"
              :class="currentId === list.id && 'active-sidepane'"
              @click="
                handleSetting(list.title, list.isDesk, index)
                onClickPage({ path: 'Page', id: list.id, name: list.title, seo: list.seo })
                earseDisable()
              "
            >
              <input
                v-model.lazy="list.title"
                class="other-pages-input cursor-text"
                :class="disable !== index && 'disable-input'"
                :readonly="disable !== index"
                @keyup.enter="editPagehandler(list.id, list.title)"
              />
              <SidepaneMenu :name="list.title" @clicked="menuClicked">
                <button
                  class="invisible rounded-full p-2 active:bg-black/20 group-hover:visible group-hover:text-black/50"
                >
                  <Icon class="h-5 w-5">{{ mdiCogOutline }}</Icon>
                </button>
              </SidepaneMenu>
            </div>
          </template>
          <template v-if="newOtherPages" class="flex flex-row">
            <form class="form-horizontal" role="form" @submit.prevent>
              <div
                class="sidepane__sub-item text-brownish-grey felx flex-row pb-0.5 pl-6 pr-0 pt-1 text-base hover:cursor-pointer"
              >
                <input
                  v-model.lazy="defaultpage.title"
                  class="other-pages-input cursor-text"
                  @keyup.enter="newPagehandler"
                />
              </div>
            </form>
          </template>
          <div
            class="my-4 flex h-auto w-auto cursor-pointer flex-row items-center self-center py-2"
            @click="newOtherPages = true"
          >
            <p class="text-brownish-grey h-auto text-sm">New page</p>
            <span class="my-auto ml-4 mr-0 rounded-full bg-black bg-opacity-10 p-1"
              ><Icon class="h-4 w-4 opacity-80">{{ mdiPlus }}</Icon></span
            >
          </div>
        </div>
      </transition>

      <transition name="deskpage-show">
        <div
          v-if="isDeskpages"
          class="absolute bottom-3 ml-3 flex w-8 cursor-pointer items-center justify-end"
          @click="
            settingName = 'Front Page'
            isDeskpages = false
            onClickPage({ path: 'front', id: 'front' })
          "
        >
          <Icon class="h-8 w-8">{{ mdiArrowLeft }}</Icon>
        </div>
      </transition>
    </div>
    <UnsavedDialog />
  </div>
</template>

<style lang="scss" scoped>
.custom-overflow {
  @apply overflow-visible;
}
.shadow {
  box-shadow: 0 2px 5px 2px rgb(0 0 0 / 85%);
}

.sidepane {
  .active-sidepane {
    @apply text-darker-indigo relative;

    background: rgb(193 193 193 / 10%);
  }
}

.other-pages-input {
  @apply border-clear-blue mr-0 rounded border bg-white px-2 py-1;

  outline: none;
  width: 77%;
}

.disable-input {
  @apply cursor-pointer select-none border border-transparent bg-transparent;
}

.deskpage-show-enter,
.deskpage-show-leave-to,
.fade-top-enter,
.fade-enter,
.fade-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}

.fade-top-leave-to {
  display: none;
}

.deskpage-show-enter-active {
  transition: all 0.35s ease;
  transition-delay: 0.2s;
}

.fade-enter-active,
.fade-top-enter-active {
  transition: all 0.25s ease;
  transition-delay: 0.4s;
}

.fade-top-leave-active {
  transition: all 0.19s ease;
}

.fade-leave-active,
.deskpage-show-leave-active {
  transition: all 0.35s ease;
}
</style>
