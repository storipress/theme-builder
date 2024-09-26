<script lang="ts">
import { formatDistanceToNow, parseISO } from 'date-fns'
import { debounce, omit } from 'lodash'
import Tooltip from 'shared/components/tooltip.vue'
import { clickOutside } from 'shared/directives/click-outside'
import { $URL, withHttps } from 'ufo'
import { defineComponent } from 'vue-demi'
import { mapActions, mapGetters, mapState } from 'vuex'

import { SET_SAVING_STATUS } from '../../../store'
import { articleHelpers } from '../../../store/modules/article/constants'
import { commonHelpers } from '../../../store/modules/common'
import { Dialog } from '../dialog'
import ReleaseIndicator from './release-indicator.vue'
import SettingDialog from './settings/setting-dialog.vue'

function handleBeforeunload(e: any) {
  const event = e || window.event
  /*
    Most modern browsers will no longer actually show this message,
    just their own. But to trigger it, you have to return one, so may as well make it useful.
  */
  const msg = 'Changes that you made may not be saved.'

  if (event) {
    event.returnValue = msg // IE
  }
  return msg // Everyone else
}

export default defineComponent({
  name: 'Toolbar',
  directives: { clickOutside },
  components: {
    Dialog,
    ReleaseIndicator,
    SettingDialog,
    Tooltip,
  },
  props: {
    value: {
      type: String,
    },
  },
  data: () => {
    const autoSave = debounce(function () {
      // @ts-expect-error
      this.updateCurrentPage()
    }, 10_000)

    return {
      isShowPublishInfo: false,
      isSidepaneShow: false,
      isMiniMenuShow: true,
      prevValue: 'desktop',
      autoSave,
      returnURL: null as string | null,
    }
  },

  computed: {
    title(): string {
      switch (this.$route.name) {
        case 'article':
          return `Article Layouts: ${this.currentLayout.name}`

        case 'front-page':
          return 'Front Page'

        case 'other':
          return 'Other Pages'
      }
      return ''
    },
    homeUrl(): string {
      if (this.returnURL) {
        const url = new $URL(this.returnURL)
        // prevent open redirect
        return url.fullpath
      }

      const clientID = this.$route.params.clientID
      return clientID ? `/${clientID}/articles/desks/all` : '/workspaces'
    },
    saveBtnIconClass(): string {
      switch (this.savingStatus) {
        case 'done':
          return 'icon-save text-grassy-green'

        case 'loading':
          return 'icon-dots_horizontal bg-white-grey rounded-full'

        case 'edited':
        default:
          return 'icon-save'
      }
    },
    saveBtnTooltip(): string {
      switch (this.savingStatus) {
        case 'done':
          return 'Saved'

        case 'loading':
          return 'Saving...'

        case 'edited':
        default:
          return 'Save'
      }
    },
    staticSiteUrl(): string {
      const { customer_site_domain: customerSiteDomain } = this.site
      return withHttps(customerSiteDomain)
    },

    ...mapState(['savingStatus', 'isDeploying']),
    ...mapGetters([
      'isPreviewMode',
      'currentStoreModule',
      'currentStep',
      'isUndoable',
      'isRedoable',
      'lastSuccessRelease',
    ]),
    ...commonHelpers.mapState(['site']),
    ...articleHelpers.mapState(['currentLayout']),
  },

  methods: {
    togglePreview(preview: string) {
      if (this.isPreviewMode) {
        preview = this.prevValue
      } else if (preview !== 'expanded') {
        this.prevValue = preview
      }

      this.$emit('input', preview)
    },
    togglePublishInfo() {
      this.isShowPublishInfo = !this.isShowPublishInfo
    },
    closePublshInfo() {
      this.isShowPublishInfo = false
    },
    closeSettingLog() {
      this.isSidepaneShow = false
    },
    handleSaveClick() {
      if (this.savingStatus !== 'edited') return

      this.autoSave.cancel()
      this.updateCurrentPage()
    },
    handleDeployClick() {
      this.publish()
    },
    toggleMiniMenu() {
      this.isMiniMenuShow = !this.isMiniMenuShow
    },
    getLastDeployTime(): string {
      if (!this.lastSuccessRelease || !this.lastSuccessRelease.created_at) {
        return 'N/A'
      }
      return `${formatDistanceToNow(parseISO(this.lastSuccessRelease.created_at))} ago.`
    },

    ...mapActions(['updateCurrentPage', 'publish', 'fetchReleases', 'undo', 'redo']),
    ...commonHelpers.mapActions(['fetchSite']),
  },

  watch: {
    currentStep() {
      this.autoSave()
      this.$store.commit(SET_SAVING_STATUS, 'edited')
    },
    currentStoreModule() {
      this.autoSave.cancel()
      setTimeout(() => this.$store.commit(SET_SAVING_STATUS, 'done'), 1000)
    },
    savingStatus(val) {
      if (val === 'edited') {
        window.addEventListener('beforeunload', handleBeforeunload)
      } else {
        window.removeEventListener('beforeunload', handleBeforeunload)
      }
    },
  },

  created() {
    this.fetchReleases()
    this.fetchSite()
  },

  mounted() {
    if (this.$route.query.return_url && typeof this.$route.query.return_url === 'string') {
      this.returnURL = this.$route.query.return_url
      this.$router.replace({
        path: this.$route.path,
        query: omit(this.$route.query || {}, 'return_url'),
      })
    }
  },

  beforeUnmount() {
    this.autoSave.cancel()
    window.removeEventListener('beforeunload', handelBeforeunload)
  },
})
</script>

<template>
  <div class="toolbar-wrapper pointer-events-none fixed flex w-full flex-row-reverse p-2">
    <div class="toolbar pointer-events-auto rounded" :class="{ 'w-full': !isPreviewMode, hide: !isMiniMenuShow }">
      <div
        v-show="isPreviewMode"
        class="hover:bg-white-grey flex cursor-pointer items-center rounded-l px-1"
        @click="toggleMiniMenu"
      >
        <i
          class="text-xs transition-all"
          :class="
            isMiniMenuShow ? 'icon-chevron_right opacity-40' : 'icon-chevron_left text-medium-blue font-bold opacity-80'
          "
        />
      </div>
      <div v-show="!isPreviewMode" class="flex flex-1">
        <div class="flex items-center">
          <span class="section border-light-grey-blue flex items-center">
            <a :href="homeUrl" rel="noopener">
              <span class="icon-chevron_left pl-2 text-xl" />
            </a>
          </span>
        </div>

        <div
          class="toolbar__title px-2"
          :class="isSidepaneShow && 'toolbar__title--active'"
          aria-haspopup="true"
          :aria-expanded="`${isSidepaneShow}`"
        >
          <div class="flex w-full flex-col leading-none">
            <span>{{ title }}</span>
            <ReleaseIndicator />
          </div>
        </div>
      </div>
      <div v-show="!isPreviewMode" class="flex flex-1 justify-center">
        <Tooltip class="tooltip-container" enabled placement="bottom" :arrow="false" content="Desktop" :distance="4">
          <button
            class="toolbar-btn w-11 items-end px-1 py-2"
            :class="{ 'bg-white-grey': value === 'desktop' }"
            @click="togglePreview('desktop')"
          >
            <span class="flex items-center justify-center text-3xl">
              <i class="icon-desktop" />
            </span>
          </button>
        </Tooltip>
        <Tooltip class="tooltip-container" enabled placement="bottom" :arrow="false" content="Tablet" :distance="4">
          <button
            class="toolbar-btn w-11 items-end px-1 py-2"
            :class="{ 'bg-white-grey': value === 'tablet' }"
            @click="togglePreview('tablet')"
          >
            <span class="flex items-center justify-center text-3xl">
              <i class="icon-tablet" />
            </span>
          </button>
        </Tooltip>
        <Tooltip class="tooltip-container" enabled placement="bottom" :arrow="false" content="Mobile" :distance="4">
          <button
            class="toolbar-btn w-11 items-end px-1 py-2"
            :class="{ 'bg-white-grey': value === 'mobile' }"
            @click="togglePreview('mobile')"
          >
            <span class="flex items-center justify-center text-3xl">
              <i class="icon-mobile" />
            </span>
          </button>
        </Tooltip>
      </div>

      <div class="flex flex-1 justify-end">
        <div v-show="!isPreviewMode" class="flex items-center">
          <Tooltip class="tooltip-container" enabled placement="bottom" :arrow="false" content="Undo" :distance="4">
            <button
              class="toolbar-btn editor-btn w-11 px-1 py-2"
              :class="isUndoable && 'enable'"
              :disabled="!isUndoable"
              @click="undo"
            >
              <span class="flex items-center justify-center text-lg">
                <i class="icon-undo p-1" />
              </span>
            </button>
          </Tooltip>
          <Tooltip class="tooltip-container" enabled placement="bottom" :arrow="false" content="Redo" :distance="4">
            <button
              class="toolbar-btn editor-btn w-11 px-1 py-2"
              :class="isRedoable && 'enable'"
              :disabled="!isRedoable"
              @click="redo"
            >
              <span class="flex items-center justify-center text-lg">
                <i class="icon-redo p-1" />
              </span>
            </button>
          </Tooltip>
        </div>
        <div class="flex items-center justify-center">
          <Tooltip class="tooltip-container" enabled placement="bottom" :arrow="false" content="Settings" :distance="4">
            <button
              v-show="!isPreviewMode"
              class="toolbar-btn w-11 border-l px-1 py-2"
              data-intercom-target="Setting Button"
              @click="isSidepaneShow = !isSidepaneShow"
            >
              <span class="flex items-center justify-center text-lg">
                <i class="icon-settings p-1" />
              </span>
            </button>
          </Tooltip>
          <Tooltip
            class="tooltip-container"
            enabled
            placement="bottom"
            :arrow="false"
            :content="saveBtnTooltip"
            :distance="4"
          >
            <button
              v-show="!isPreviewMode"
              class="toolbar-btn text-almost-black w-11 border-l px-1 py-2"
              :class="[
                savingStatus === 'edited' ? 'cursor-pointer text-opacity-75' : 'cursor-not-allowed text-opacity-30',
              ]"
              @click="handleSaveClick"
            >
              <span class="flex items-center justify-center text-lg">
                <i class="p-1" :class="saveBtnIconClass" />
              </span>
            </button>
          </Tooltip>
          <Tooltip class="tooltip-container" enabled placement="bottom" :arrow="false" content="Preview" :distance="4">
            <button class="toolbar-btn w-11 border-l px-1 py-2" @click="togglePreview('expanded')">
              <span class="flex items-center justify-center text-lg">
                <i class="icon-preview p-1" :class="isPreviewMode && 'text-clear-blue'" />
              </span>
            </button>
          </Tooltip>
          <div v-click-outside="closePublshInfo" class="h-full">
            <button class="toolbar-btn w-auto rounded-r border-l p-3" @click="togglePublishInfo">
              Publish <i class="ml-2 text-xs" :class="isShowPublishInfo ? 'icon-chevron_up' : 'icon-chevron_down'" />
            </button>
            <transition name="fade">
              <div
                v-if="isShowPublishInfo"
                class="publish-info shadow-2 absolute right-0 top-full mt-2 w-max rounded bg-white p-4 text-sm leading-4"
              >
                <template v-if="isDeploying">
                  <h6 class="flex items-center text-sm">
                    <i class="icon-upload mr-2 text-base leading-4" />
                    Production
                  </h6>
                  <div class="my-2 flex items-start justify-end gap-2">
                    <p class="opacity-50">Build in progress. This may take up to 3 minutes.</p>
                    <Tooltip
                      class="tooltip-container deploy-info"
                      enabled
                      placement="bottom"
                      :arrow="false"
                      content="Storipress uses an approach to site building called JAMstack, which requires some time to compile and upload your assets to our servers. JAMstack makes your site super fast and scalable for great SEO, but requires some build time."
                      :distance="4"
                    >
                      <i class="icon-info text-base leading-4 text-black" />
                    </Tooltip>
                  </div>
                </template>
                <template v-else>
                  <h6 class="text-sm leading-4">Production</h6>
                  <p class="my-2 opacity-50">Last deploy was {{ getLastDeployTime() }}</p>
                </template>

                <div class="mt-4">
                  <button
                    class="shadow-1 hover:bg-white-grey rounded px-3 py-2 transition-colors"
                    @click="handleDeployClick"
                  >
                    <i class="icon-rocket mr-2" />Build + Deploy Changes
                  </button>
                  <a
                    class="shadow-1 hover:bg-white-grey ml-3 rounded px-3 py-2 transition-colors"
                    :href="staticSiteUrl"
                    target="_blank"
                    noopener
                    noreferrer
                    @click="closePublshInfo"
                  >
                    <i class="icon-link_variant mr-2" />Visit Site
                  </a>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <Dialog center :visable="isSidepaneShow" @click="closeSettingLog">
      <SettingDialog @close="closeSettingLog" />
    </Dialog>
  </div>
</template>

<style lang="scss" scoped>
.toolbar {
  @apply text-almost-black shadow-1 relative z-10 flex justify-between bg-white transition-transform;

  height: 2.6rem;

  &__title {
    @apply -mt-2px flex select-none items-center justify-between pr-2;
  }

  &__subtitle {
    @apply text-xs font-light leading-4;

    font-family: Lato, sans-serif;
  }

  .tooltip-container {
    @apply bg-transparent p-0;

    &::v-deep > .tooltip {
      @apply top-1 rounded;
    }

    &.deploy-info::v-deep > .tooltip {
      @apply w-60 leading-tight;
    }
  }

  &.hide {
    transform: translateX(calc(100% - 16px));
  }
}

.toolbar-btn {
  @apply hover:bg-white-grey flex h-full items-center justify-center transition-colors;
}

.section {
  padding-left: 10px;
  padding-right: 10px;

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }
}

.editor-btn {
  @apply stroke-current text-opacity-50;

  &.enable {
    @apply text-opacity-100;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
