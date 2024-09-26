<script lang="ts">
import { PortalTarget } from 'portal-vue'

import Logo from '../../../../assets/logo.svg'
import { articleHelpers } from '../../../../store/modules/article/constants'
import Dialog from './outter-dialog.vue'
import SettingContent from './setting-content.vue'
import SettingMenu from './setting-menu.vue'

export default defineComponent({
  components: { SettingContent, SettingMenu, PortalTarget, Dialog, Logo },

  provide() {
    return {
      closeDialog: () => {
        this.$emit('close')
      },
    }
  },

  data: () => ({
    settingName: 'Front Page',
    isDeskpages: false,

    currentPage: { path: 'front', id: 'front' },
    isPortalshown: false,
    isDelete: null as null | boolean,
    deleteName: '',
    sentDeletesignal: false,
  }),

  methods: {
    handleSetting(name: string, isDesk: boolean): void {
      this.isDeskpages = isDesk
      this.settingName = name === 'Desk Pages' ? 'Business' : name
    },
    onClickedMenu(value: { path: string; id: string }): void {
      this.currentPage = value
    },
    actionHandler(value: { action: string; name: string }): void {
      if (value.action === 'delete') {
        this.isDelete = true
        this.deleteName = value.name
      }
    },
    deletePagehandler(): void {
      this.sentDeletesignal = true
      this.isDelete = false
      setTimeout(() => (this.sentDeletesignal = false), 2000)
    },

    handleClose(): void {
      this.$emit('close')
    },
    ...articleHelpers.mapActions(['fetchLayouts']),
  },

  created() {
    if (this.$route.name === 'article') {
      this.currentPage = { id: 'article', path: 'article' }
    }
  },

  mounted() {
    this.fetchLayouts()
  },
})
</script>

<template>
  <div class="setting-popup">
    <div class="relative flex h-full w-full flex-row bg-white">
      <div class="sidepane noscrollbar">
        <SettingMenu
          :deletesignal="sentDeletesignal"
          :default-page="currentPage"
          @clicked="onClickedMenu"
          @action-handler="actionHandler"
        />
      </div>
      <div class="noscrollbar relative top-0 h-full w-full grow justify-center overflow-y-scroll">
        <SettingContent :current-page="currentPage" />
        <PortalTarget name="settingWarning" />
      </div>
      <button @click="handleClose">
        <i class="icon-cross_thin absolute right-3 top-3 text-sm" />
      </button>
      <PortalTarget name="deletePages" />
      <Dialog v-if="isDelete" center width="40">
        <template>
          <div class="new-popup">
            <div class="border-warm-grey block border-b px-10 py-6">
              <div class="mx-auto mb-2 flex w-auto flex-row">
                <div class="ml-0 mr-5 items-start">
                  <div class="dark-indigo rounded-full p-4"><Logo class="text-almost-black h-12 w-12" /></div>
                </div>
                <div class="flex flex-col items-start text-left">
                  <h2 class="text-brownish-grey -mb-1 mt-0 text-base font-light">Other Pages</h2>
                  <h1 class="mb-1 mt-0 text-2xl text-black">Delete Page</h1>
                  <p class="text-brownish-grey mb-0 text-sm">
                    {{ `Permanently delete this ${deleteName} page. Warning: this action is irreversable. ` }}
                  </p>
                </div>
              </div>
            </div>
            <div class="flex flex-row">
              <button
                class="border-warm-grey text-brownish-grey flex-1 items-center border-r py-2.5 text-center font-light uppercase tracking-widest"
                @click="isDelete = false"
              >
                Cancel
              </button>
              <button
                class="color flex-1 items-center py-2.5 text-center font-light uppercase tracking-widest text-white"
                @click="deletePagehandler"
              >
                delete
              </button>
            </div>
          </div>
        </template>
      </Dialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setting-popup {
  @apply mx-auto my-auto overflow-hidden rounded-md bg-white;

  box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0.75);
  width: 58rem;
  height: 36rem;
}

.sidepane {
  @apply relative h-full w-4/12 max-w-xs shrink bg-white pr-2;

  .active-sidepane {
    @apply text-darker-indigo;

    background: rgba(193, 193, 193, 0.1);
  }
}

.shadow {
  box-shadow: 0 2px 5px 2px rgba(0, 0, 0, 0.1);
}

.noscrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
    display: none;
  }
}

.dark-indigo {
  background: #0a2542;
}

.new-popup {
  @apply font-lato;

  input {
    @apply bg-pale-grey-two text-brownish-grey mb-1 w-full px-2 py-2;

    outline: none;

    &::placeholder {
      @apply bg-pale-grey-two text-brown-grey text-sm;
    }
  }

  .color {
    background: #a73838;
  }
}
</style>
