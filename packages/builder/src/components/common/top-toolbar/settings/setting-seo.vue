<script lang="ts">
import type { EditableSEO } from 'shared/types/seo'
import type { PropType } from 'vue-demi'
import type { Desk, Page } from '../../../../api'
import slugify from '@sindresorhus/slugify'
import { match } from 'ts-pattern'

import { defineAsyncComponent, defineComponent } from 'vue-demi'
import { getDesign, getPages, listDesks, updateDesignInfo, updateDeskInfo, updatePageInfo } from '../../../../api'
import { commonHelpers } from '../../../../store/modules/common'
import AutoSizeInput from '../../auto-size-input.vue'
import ToggleSwitch from '../toggle-switch.vue'
import GooglePreview from './google-preview.vue'
import InputCase from './input-case.vue'
import SettingBtn from './setting-button.vue'
import ShowCase from './show-case.vue'
import SocialPreview from './social-preview.vue'

const DEFAULT_HEAD_CODE = '<!-- write some code for the head -->'
const DEFAULT_BODY_CODE = '<!-- write some code for the body -->'

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

function findingObject(list: { id: string; seo?: string }[], targetId: string) {
  return list.find((item) => item.id === targetId) ?? {}
}

function ensureObject(item: unknown): object {
  return typeof item === 'object' && item !== null ? item : {}
}

export default defineComponent({
  components: {
    Codemirror: defineAsyncComponent(() => import('./codemirror')),
    ToggleSwitch,
    SettingBtn,
    AutoSizeInput,
    ShowCase,
    GooglePreview,
    SocialPreview,
    InputCase,
  },
  props: {
    currentPage: {
      type: Object as PropType<CurrentPage>,
      required: true,
    },
    currentTab: {
      type: String as PropType<'seo' | 'opengraph' | 'custom'>,
      required: true,
    },
  },
  data() {
    return {
      formatSEO: {
        titleMain: 'Basic SEO Settings',
        titleSub:
          'Specify this page’s title and description. You can see how they’ll look in search engine results pages (SERP’s) in the preview below.',
      },
      formatOpengrph: {
        titleMain: 'Open Graph Settings',
        titleSub: 'The info that shows up when sharing content on Facebook, Twitter, Linkedin, and Pinterest..',
        imgplaceholder: 'Make sure your images are at least 1200px by 630px & have a 1.91:1 aspect ratio',
      },
      formatCustomcode: {
        title:
          'Custom code and scripts will only appear on the published site. The code included here will only apply to this page, and will appear after any site-wide custom code.',
        head: `Inside <head> tag`,
        body: `Before </body> tag`,
      },
      options: {
        lineNumbers: true,
        mode: 'htmlmixed',
        tabSize: 2,
      },
      design: {} as { seo?: Required<EditableSEO> },
      deskList: [] as Desk[],
      otherList: [] as Page[],
      isChanged: false,
      slugError: '',
      seo: {
        slug: '',
        meta: {
          matched: false,
          title: '',
          description: '',
        },
        og: {
          matched: false,
          title: '',
          description: '',
        },
        ogImage: '',
        inject: {
          header: DEFAULT_HEAD_CODE,
          footer: DEFAULT_BODY_CODE,
        },
      } as Required<EditableSEO>,
    }
  },
  async mounted() {
    try {
      await Promise.all([this.getSiteInfo(), this.getDesksInfo(), this.getPagesInfo()])
      this.init()
    } catch {
      // TODO: error flow via globel error handler
    }
  },
  computed: {
    ...commonHelpers.mapState(['site']),
    currentPath(): string {
      return this.currentPage.path.toLowerCase()
    },
    currentPathName(): string {
      return this.currentPage.id.toLowerCase()
    },
    currentID(): string {
      const { currentPath, currentPathName, currentPage, deskList } = this
      if (currentPath === 'desk') {
        return currentPathName === 'desk' ? deskList?.[0]?.id : currentPage.id
      } else if (currentPath === 'page') {
        return currentPage.id
      } else {
        return ''
      }
    },
    seoJSON(): object {
      return structuredClone(this.seo)
    },
    workspace(): string {
      return this.site.workspace
    },
    siteName(): string {
      return this.site.name
    },
    siteURL(): string {
      return this.site.customer_site_domain
    },
    previewPath(): string {
      return match(this.currentPath)
        .with('desk', () => `/desks/${this.seoUrlSlug}`)
        .with('page', () => `${this.seoUrlSlug}`)
        .otherwise(() => '')
    },
    apiData(): { seo?: Required<EditableSEO> } {
      switch (this.currentPath) {
        case 'front':
          return this.design

        case 'desk':
          return this.currentPathName === 'desk' ? this.deskList[0] : findingObject(this.deskList, this.currentID)

        case 'page':
          return findingObject(this.otherList, this.currentID)
      }
      return {}
    },
    defaultSEO(): Required<EditableSEO> {
      const { site, apiData, currentPath } = this
      const target = currentPath === 'desk' ? apiData : site

      return {
        meta: {
          matched: true,
          title: target.name,
          description: target.description || site.description,
        },
        og: {
          matched: true,
          title: target.name,
          description: target.description || site.description,
        },
        slug: target.slug || slugify(target.name),
        ogImage: '',
        inject: {
          header: DEFAULT_HEAD_CODE,
          footer: DEFAULT_BODY_CODE,
        },
      }
    },
    seoInfo(): Required<EditableSEO> {
      const { apiData, defaultSEO } = this

      return apiData?.seo ?? defaultSEO
    },
    seoUrlSlug: {
      get(): string {
        return this.seo.slug
      },
      set(val: string) {
        this.seo.slug = slugify(val)
      },
    },
  },
  methods: {
    init() {
      const { seoInfo, defaultSEO } = this
      this.seo = {
        slug: seoInfo.slug || defaultSEO.slug,
        meta: {
          matched: true,
          title: seoInfo.meta?.title || defaultSEO.meta.title,
          description: seoInfo.meta?.description || defaultSEO.meta.description,
        },
        og: {
          matched: seoInfo.og?.matched ?? true,
          title: seoInfo.og?.title || defaultSEO.og?.title,
          description: seoInfo.og?.description || defaultSEO.og?.description,
        },
        ogImage: seoInfo.ogImage || '',
        inject: {
          header: seoInfo.inject?.header || DEFAULT_HEAD_CODE,
          footer: seoInfo.inject?.footer || DEFAULT_BODY_CODE,
        },
      }
    },
    async getSiteInfo() {
      this.design = (await getDesign()) as { seo?: Required<EditableSEO> }
    },
    async getDesksInfo() {
      const desks = await listDesks()
      this.deskList = desks.map((desk) => {
        return {
          ...desk,
          seo: {
            ...ensureObject(desk.seo),
            // ensure use slug first as this is the first priority
            slug: desk.slug || desk.seo?.slug || slugify(desk.name),
          },
        }
      })
    },
    async getPagesInfo() {
      this.otherList = await getPages()
    },
    async fetchDataAdapter() {
      switch (this.currentPath) {
        case 'front':
          await this.getSiteInfo()
          break

        case 'desk':
          await this.getDesksInfo()
          break

        case 'page':
          await this.getPagesInfo()
      }
    },
    async updateDesignhandler() {
      await updateDesignInfo('home', this.seoJSON)
      this.getSiteInfo()
    },
    async updateDeskhandler() {
      if (this.slugError) {
        this.isChanged = true
        return
      }
      await updateDeskInfo(this.currentID, this.seoJSON, this.seo.slug)
      this.getDesksInfo()
    },
    async updatePagehandler() {
      if (this.slugError) {
        this.isChanged = true
        return
      }
      await updatePageInfo(this.currentID, this.seoJSON)
      this.getPagesInfo()
    },
    formUpdated(): void {
      this.isChanged = true
    },
  },
  watch: {
    currentPage() {
      this.slugError = ''
      this.isChanged = false
      this.init()
      this.fetchDataAdapter()
    },
    isChanged(val: boolean) {
      if (!val) {
        switch (this.currentPath) {
          case 'front':
            this.updateDesignhandler()
            break

          case 'desk':
            this.updateDeskhandler()
            break

          case 'page':
            this.updatePagehandler()
            break

          // No default
        }
      }
    },
    seoUrlSlug(val: string) {
      this.slugError = ''

      if (this.currentPath === 'desk') {
        const desksWithCurrent = this.deskList.filter((desk) => desk.id !== this.currentID)

        if (desksWithCurrent.some((desk) => desk.slug === val)) {
          this.slugError = 'Slug must be unique'
        }
      }

      if (this.currentPath === 'page') {
        const pagesWithCurrent = this.otherList.filter((page) => page.id !== this.currentID)

        if (pagesWithCurrent.some((page) => page.seo.slug === val)) {
          this.slugError = 'Slug must be unique'
        }
      }
    },
  },
})
</script>

<template>
  <div class="seo-container">
    <template v-if="currentTab !== 'custom'">
      <div class="mb-4 mt-16 text-left">
        <h1 class="text-brownish-grey text-base font-light">
          {{ currentTab === 'seo' ? formatSEO.titleMain : formatOpengrph.titleMain }}
        </h1>
        <h2 class="text-brownish-grey text-sm">
          {{ currentTab === 'seo' ? formatSEO.titleSub : formatOpengrph.titleSub }}
        </h2>
      </div>
      <GooglePreview
        v-if="currentTab === 'seo'"
        :title="seo.meta.title"
        :site-name="siteName"
        :site-u-r-l="siteURL"
        :path="previewPath"
        :description="seo.meta.description"
        :append-site-name="currentPath !== 'front'"
      />
      <SocialPreview
        v-else
        :title="seo.og.matched ? seo.meta.title : seo.og.title"
        :site-name="siteName"
        :site-u-r-l="siteURL"
        :path="previewPath"
        :description="seo.og.matched ? seo.meta.description : seo.og.description"
        :image="seo.ogImage"
        :append-site-name="currentPath !== 'front'"
      />

      <ShowCase v-if="currentTab === 'seo'">
        <InputCase>
          <label for="title_seo">Title Tag</label>
          <div class="relative">
            <span
              v-if="currentPath !== 'front'"
              class="opacity-15 pointer-events-none absolute left-0 top-0 text-black"
            >
              {{ seo.meta.title }} - {{ siteName }}
            </span>
            <input
              id="title_seo"
              v-model="seo.meta.title"
              class="w-full"
              type="text"
              name="title_seo"
              @keyup="formUpdated"
            />
          </div>
        </InputCase>
        <InputCase v-if="currentPath !== 'front'">
          <template #default>
            <label for="website">URL Slug</label>
            <div class="flex flex-row">
              <span class="opacity-15 text-black">{{ siteURL }}/</span>
              <input id="website" v-model="seoUrlSlug" type="text" name="website" @keyup="formUpdated" />
            </div>
          </template>
          <template #error>
            <div v-if="slugError" class="text-sm text-red-500">
              {{ slugError }}
            </div>
          </template>
        </InputCase>
        <InputCase>
          <label for="description_seo">Meta Description</label>
          <div>
            <AutoSizeInput
              id="description_seo"
              v-model="seo.meta.description"
              type="textarea"
              name="description_seo"
              placeholder="Describe your page. Optimal description length is 155 to 300 characters."
              @keyup="formUpdated"
            />
          </div>
        </InputCase>
      </ShowCase>
      <ShowCase v-else>
        <div class="mb-8 flex h-auto w-full flex-row items-center text-left">
          <div class="flex w-11/12 flex-col">
            <h2 class="text-base">Match Basic SEO</h2>
            <h3 class="title-medium-light-grey text-xs">
              Make the Open Graph Title and Description same as the SEO Title Tag and Meta Description
            </h3>
          </div>
          <div class="flex w-1/12 align-middle" @click="formUpdated">
            <ToggleSwitch v-model="seo.og.matched" name="matchseo" />
          </div>
        </div>
        <InputCase>
          <label for="title_graph">Open Graph Title</label>
          <div class="relative">
            <span
              v-if="currentPath !== 'front'"
              class="opacity-15 pointer-events-none absolute left-0 top-0 text-black"
            >
              {{ seo.og.matched ? seo.meta.title : seo.og.title }} - {{ siteName }}
            </span>
            <input
              id="title_graph"
              v-model="seo.og.title"
              :class="[seo.og.matched && 'invisible']"
              type="text"
              name="title_graph"
              @keyup="formUpdated"
            />
          </div>
        </InputCase>
        <InputCase>
          <label for="description_graph">Open Graph Description</label>
          <template v-if="seo.og.matched">
            <AutoSizeInput
              id="description_graph"
              type="textarea"
              name="description_graph"
              disabled
              :value="seo.meta.description"
            />
          </template>
          <template v-else>
            <AutoSizeInput
              id="description_graph"
              v-model="seo.og.description"
              type="textarea"
              name="description_graph"
              placeholder="Describe your page. Optimal description length is 155 to 300 characters."
              @keyup="formUpdated"
            />
          </template>
        </InputCase>
        <InputCase>
          <label for="image_url">Open Graph Image URL</label>
          <input
            id="image_url"
            v-model="seo.ogImage"
            type="text"
            name="image_url"
            :placeholder="formatOpengrph.imgplaceholder"
            @keyup="formUpdated"
          />
        </InputCase>
      </ShowCase>
    </template>
    <template v-else>
      <div class="mb-4 mt-16 text-left">
        <h2 class="text-brownish-grey text-sm">
          {{ formatCustomcode.title }}
        </h2>
      </div>
      <div class="code-case">
        <label class="text-brownish-grey text-sm" for="head_code">{{ formatCustomcode.head }}</label>
        <div class="flex h-auto w-full bg-white">
          <Codemirror
            id="head_code"
            v-model="seo.inject.header"
            name="head_code"
            class="head flex-1 pl-2 pt-1 font-light"
            :options="options"
            @input="formUpdated"
          />
        </div>
      </div>
      <div class="code-case">
        <label class="text-brownish-grey text-sm">{{ formatCustomcode.body }}</label>
        <div class="flex h-40 w-full bg-white">
          <Codemirror
            id="body_code"
            v-model="seo.inject.footer"
            name="body_code"
            class="body flex-1 pl-2 pt-1 font-light"
            :options="options"
            @input="formUpdated"
          />
        </div>
      </div>
    </template>
    <SettingBtn v-model="isChanged" class="flex-1" />
  </div>
</template>

<style lang="scss" scoped>
.seo-container {
  @apply font-lato relative flex h-full flex-col overflow-y-scroll bg-transparent py-0 pb-8 pl-8 pr-12;

  width: 42.813rem;

  // height: 36rem;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
    display: none;
  }
}

.code-case {
  @apply mb-4 h-auto w-full bg-transparent text-left;

  &::v-deep .vue-codemirror {
    /* stylelint-disable-next-line selector-class-pattern */
    .CodeMirror {
      @apply h-44 w-full rounded p-0;

      border: solid 1px #e9e9e9;
      width: 36.5rem;

      &-scroll {
        @apply w-full bg-white p-0;
      }

      /* stylelint-disable-next-line selector-class-pattern */
      .CodeMirror-lines {
        &::before {
          @apply px-1;

          content: '<head>';
        }

        &::after {
          @apply px-1;

          content: '</head>';
        }
      }

      * {
        font-family: monospace;
        font-size: 14px;
      }
    }

    /* stylelint-disable-next-line selector-class-pattern */
    &.body .CodeMirror-lines {
      &::before {
        @apply px-1;

        content: '<body>';
      }

      &::after {
        @apply px-1;

        content: '</body>';
      }
    }
  }
}
</style>
