<script lang="ts">
import { defineComponent } from 'vue-demi'

import { useOtherPage } from '../use-other-page'
import { ElementPicker } from './element-picker'
import { PreviewArea } from './preview-area'

export default defineComponent({
  name: 'OtherBuilder',
  components: { PreviewArea, ElementPicker },
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    return useOtherPage(props)
  },
})
</script>

<template>
  <div :class="$style.previewContainer">
    <div :class="[isPreviewMode ? 'overflow-hidden' : 'w-3/5']">
      <PreviewArea :class="$style.previewArea" />
    </div>
    <div v-show="!isPreviewMode" class="scrollbar-hide w-2/5">
      <ElementPicker :class="$style.elementPicker" />
    </div>
  </div>
</template>

<style lang="scss" module>
.preview-container {
  @apply flex h-full w-full overflow-hidden;

  :global(.expanded) & {
    @apply block h-auto;
  }
}

.preview-area {
  @apply pb-4 pt-12;
}

.element-picker {
  @apply pb-4 pt-12;
}
</style>
