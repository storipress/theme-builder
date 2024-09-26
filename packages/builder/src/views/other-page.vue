<script lang="ts">
import { ViewportCapturer } from '@storipress/editor-core'
import { mapState } from 'vuex'

import { LoadingMask } from '../components/loading'
import { OtherBuilder } from '../components/other-builder'
import { OtherEditor } from '../components/other-editor'
import { Unsplash } from '../components/unsplash'
import { otherHelper } from '../store/modules/other'
import { SET_ID, SET_MODE } from '../store/modules/other/constants'

export default defineComponent({
  components: { OtherBuilder, OtherEditor, ViewportCapturer, LoadingMask, Unsplash },

  computed: {
    pageMode: {
      get(): string {
        return this.mode
      },

      set(mode: string) {
        this.setMode(mode)
      },
    },

    ...mapState({
      id: (state: any) => state.route?.params?.oid,
    }),
    ...otherHelper.mapState(['mode']),
  },

  methods: {
    ...otherHelper.mapActions(['updateCurrentPage']),
    ...otherHelper.mapMutations({ setMode: SET_MODE, setID: SET_ID }),
  },
  watch: {
    id() {
      this.setID(this.id)
    },
    async pageMode() {
      this.setID(this.id)
      await this.updateCurrentPage()
    },
  },
  mounted() {
    this.setID(this.id)
  },
})
</script>

<template>
  <LoadingMask class="h-full w-full">
    <div class="flex h-full">
      <OtherBuilder v-if="id && pageMode === 'design'" :id="id" :key="id" />
      <OtherEditor v-if="id && pageMode === 'edit'" :id="id" :key="id" />
      <ViewportCapturer />
      <div class="actions shadow-1 fixed bottom-2 left-2 overflow-hidden rounded-sm border bg-white">
        <button class="px-3 py-2 uppercase" :class="pageMode === 'edit' && 'active'" @click="pageMode = 'edit'">
          edit
        </button>
        <button
          class="border-l px-3 py-2 uppercase"
          :class="pageMode === 'design' && 'active'"
          @click="pageMode = 'design'"
        >
          design
        </button>
      </div>
      <Unsplash />
    </div>
  </LoadingMask>
</template>

<style lang="scss" scoped>
.other-pages {
  @apply h-full;
}

.active {
  background-color: #f0f0f0;
}
</style>
