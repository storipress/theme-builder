<script lang="ts">
import { computed, defineComponent, watch } from 'vue-demi'
import { useActions, useStore } from 'vuex-hooks'

import LoadingMask from '../loading/loading-mask.vue'
import { useLoadingStore } from '../loading/loading-store'
import { ElementPicker } from './element-picker'
import { PreviewArea } from './preview-area'

export default defineComponent({
  components: { LoadingMask, ElementPicker, PreviewArea },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore()
    const loadingStore = useLoadingStore()
    const isPreviewMode = computed(() => store.getters.isPreviewMode)
    const { loadLayout } = useActions('article')

    watch(
      () => props.id,
      (id: string) => {
        loadingStore.waitPromise(
          loadLayout(id),
          'Fail to load article template. Please check your network connection and try again.',
        )
      },
      { immediate: true },
    )

    return { isPreviewMode }
  },
})
</script>

<template>
  <LoadingMask class="h-full">
    <div class="preview-container overflow-hidden" :class="[isPreviewMode ? 'block h-auto' : 'flex h-full']">
      <div :class="[isPreviewMode ? 'overflow-hidden' : 'w-3/5']">
        <PreviewArea class="preview-area" />
      </div>
      <div v-show="!isPreviewMode" class="scrollbar-hide w-2/5">
        <ElementPicker class="element-picker" />
      </div>
    </div>
  </LoadingMask>
</template>

<style lang="scss" scoped>
.preview-area {
  @apply pt-12;
}

.element-picker {
  @apply pb-4 pt-12;
}
</style>
