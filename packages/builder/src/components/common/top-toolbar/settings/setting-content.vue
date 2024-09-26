<script lang="ts">
import Logo from '../../../../assets/logo.svg'
import Dialog from './inner-dialog.vue'
import SettingArticle from './setting-article.vue'
import SettingSEO from './setting-seo.vue'
import SettingTab from './setting-tab.vue'

interface DialogData {
  id: string
  name: string
  isWarning: boolean
}

export default defineComponent({
  components: { SettingTab, SettingSEO, SettingArticle, Dialog, Logo },
  props: ['currentPage'],

  data: () => ({
    currentTab: 'seo',
    dialogData: {
      id: '',
      name: '',
      isWarning: false,
    },
    isShown: false,
    newLayout: '',
    newPost: '',
    deleteLayout: null as null | string,
  }),
  computed: {
    currentPath() {
      return this.currentPage.path.toLowerCase()
    },
  },
  watch: {
    currentPage() {
      this.reset()
    },
  },
  methods: {
    onClickedTab(value: string) {
      this.currentTab = value
    },
    reset() {
      this.currentTab = 'seo'
    },
    onClickedDialog(value: DialogData) {
      this.dialogData = value
      this.isShown = true
    },
    deleteLayouthandler() {
      this.deleteLayout = this.dialogData.id
      this.isShown = false
      setTimeout(() => (this.deleteLayout = null), 1000)
    },
    newLayouthandler() {
      if (this.newLayout) {
        this.newPost = this.newLayout
      }
      this.isShown = false
      this.newLayout = ''
    },
  },
})
</script>

<template>
  <div class="content">
    <template v-if="currentPath !== 'article'">
      <SettingTab :tab="currentTab" @clicked="onClickedTab" />
      <SettingSEO :current-page="currentPage" :current-tab="currentTab" />
    </template>
    <template v-else>
      <SettingArticle :new-layout="newPost" :delete-layout="deleteLayout" @clicked="onClickedDialog" />
      <Dialog v-if="isShown" center :width="dialogData.isWarning ? '40' : '30'">
        <template>
          <div class="new-popup">
            <div class="border-warm-grey block border-b px-10 py-6">
              <div class="mx-auto mb-2 flex w-auto flex-row">
                <div class="ml-0 mr-5 items-start">
                  <div class="dark-indigo rounded-full p-4"><Logo class="text-almost-black h-12 w-12" /></div>
                </div>
                <div class="flex flex-col items-start text-left">
                  <h2 class="text-brownish-grey -mb-1 mt-0 text-base font-light">Article Designs</h2>
                  <h1 class="mb-1 mt-0 text-2xl text-black">
                    {{ dialogData.isWarning ? 'Delete Design' : 'New Article Design' }}
                  </h1>
                  <p class="text-brownish-grey mb-0 text-sm">
                    {{
                      dialogData.isWarning
                        ? `Permanently delete this ${dialogData.name} article design. Warning: this action is irreversable. All articles using this design will be converted to another design.`
                        : 'Give your new article design a name.'
                    }}
                  </p>
                </div>
              </div>
              <div v-if="!dialogData.isWarning" class="mx-auto mt-4 flex w-auto flex-col">
                <label for="designtitle" class="mb-1 text-sm uppercase text-black opacity-30">input title</label>
                <input id="designtitle" v-model="newLayout" name="designtitle" placeholder="Article Design Name" />
              </div>
            </div>
            <div v-if="dialogData.isWarning" class="flex flex-row">
              <button
                class="border-warm-grey text-brownish-grey flex-1 items-center border-r py-2.5 text-center font-light uppercase tracking-widest"
                @click="isShown = false"
              >
                Cancel
              </button>
              <button
                class="color flex-1 items-center py-2.5 text-center font-light uppercase tracking-widest text-white"
                @click="deleteLayouthandler"
              >
                delete
              </button>
            </div>
            <div v-else class="flex flex-row">
              <button
                class="border-warm-grey text-brownish-grey flex-1 items-center border-r py-2.5 text-center font-light uppercase tracking-widest"
                @click="isShown = false"
              >
                Back
              </button>
              <button
                class="text-brownish-grey flex-1 items-center py-2.5 text-center font-light uppercase tracking-widest"
                @click="newLayouthandler"
              >
                New Design
              </button>
            </div>
          </div>
        </template>
      </Dialog>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.content {
  @apply relative h-full bg-white;

  width: 100%;
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
