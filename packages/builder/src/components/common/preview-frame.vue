<script lang="ts">
import { channelId } from 'shared/channel'
import invariant from 'tiny-invariant'
import { defineComponent } from 'vue-demi'

export default defineComponent({
  props: {
    path: {
      type: [Object, String],
      required: true,
    },

    width: {
      type: String,
      default: '100%',
    },

    height: {
      type: String,
      default: '100%',
    },
  },

  data() {
    const { path, $router } = this as any
    invariant(path, '<PreviewFrame /> must give a path')
    const location = typeof path === 'string' ? { path } : path

    const { href: previewPath } = $router.resolve({
      ...location,
      query: { channel: channelId },
    })

    return {
      loading: true,
      previewPath,
    }
  },

  methods: {
    handleLoad() {
      this.loading = false
      this.$emit('load')
    },
  },
})
</script>

<template>
  <div class="preview-paper">
    <div v-if="loading" class="loading">Loading Preview</div>
    <iframe :width="width" :height="height" :src="previewPath" data-hj-allow-iframe="" @load="handleLoad" />
  </div>
</template>

<style lang="scss" scoped>
.preview-paper {
  @apply shadow-3;
  @apply relative h-full w-full bg-white;
}

.loading {
  @apply absolute inset-0 flex h-full w-full items-center justify-center bg-white;
}
</style>
