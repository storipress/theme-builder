<script lang="ts">
import { defineComponent } from 'vue-demi'

import { useOtherPage } from '../use-other-page'
import { PreviewArea } from './preview-area'

export default defineComponent({
  name: 'OtherEditor',
  components: { PreviewArea },
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
    <PreviewArea :class="$style.previewArea" />
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
</style>
