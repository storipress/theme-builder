<script lang="ts">
import { injectAPI, resolveBookmarkMeta, VirtualViewport } from '@storipress/editor-core'
import { noop } from 'lodash-es'
import { IFRAMELY_OPTIONS } from 'shared/clients/iframely'
import invariant from 'tiny-invariant'
import { defineComponent } from 'vue-demi'

import { createImageURL, oEmbed, uploadOtherImage } from '../api'
import SizeObserver from '../components/common/size-observer.vue'
import { PreviewContainer } from '../components/other-preview'
import { otherHelper } from '../store/modules/other'
import { SET_HEIGHT } from '../store/modules/other/constants'

const createError = (name: string) => (): never => invariant(false, `${name} API not supported`) as never

export default defineComponent({
  components: { PreviewContainer, SizeObserver, VirtualViewport },

  computed: {
    initialized(): boolean {
      return this.$store.state?.['sync-plugin']?.initialized || false
    },

    height: {
      get(): number {
        return this.articleHeight
      },

      set(val: number) {
        this.setHeight(val)
      },
    },

    ...otherHelper.mapState({ id: 'id', articleHeight: 'height' }),
  },

  methods: {
    ...otherHelper.mapMutations({ setHeight: SET_HEIGHT }),
  },

  created() {
    injectAPI({
      createImageURL,
      createComment: noop,
      createPendingComment: noop,
      getThreads: createError('getThreads'),
      notification: {
        onNoteCreated: createError('onNoteCreated'),
        onNoteEdited: createError('onNoteEdited'),
        onNoteRemoved: createError('onNoteRemoved'),
        onPendingRemoved: createError('onPendingRemoved'),
        onThreadCreated: createError('onThreadCreated'),
        onThreadPositionUpdate: createError('onThreadPositionUpdate'),
        onThreadResolved: createError('onThreadResolved'),
      },
      removeComment: noop,
      resolveComment: noop,
      setThreadTop: noop,
      uploadImage: (file: File): Promise<string> => {
        return uploadOtherImage(this.id, file)
      },
      uploadImageFromURL: createError('uploadImageFromURL'),
      getBookmarkMeta: async (url) => {
        const data = await oEmbed({ url, params: { ...IFRAMELY_OPTIONS, card: '1' } })
        return resolveBookmarkMeta(url, data)
      },
    })
  },
})
</script>

<template>
  <SizeObserver v-model="height">
    <VirtualViewport />
    <PreviewContainer v-if="initialized" />
  </SizeObserver>
</template>
