<script lang="ts">
import { ResponsiveImage } from '@storipress/elements/common'
import { CircularProgress } from 'shared/components/circular-progress'
import { defineComponent } from 'vue-demi'
import { ElementMixin } from 'vue-slicksort'

export default defineComponent({
  name: 'ImageItem',
  components: { ResponsiveImage, CircularProgress },
  mixins: [ElementMixin],

  props: {
    url: {
      type: String,
      required: true,
    },
    uploading: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['delete'],
})
</script>

<template>
  <div class="image group relative w-fit grow">
    <ResponsiveImage class="min-h-full w-full min-w-full object-cover" :src="url" alt="img" />
    <div
      v-if="uploading"
      class="bg-opacity-24 absolute inset-0 flex h-full w-full items-center justify-center bg-black"
    >
      <CircularProgress indeterminate />
    </div>
    <div v-else class="bg-opacity-24 absolute inset-0 hidden h-full w-full bg-black group-hover:block">
      <button
        class="bg-white-grey absolute right-0 top-0 mr-2 mt-2 rounded px-1"
        @mousedown.stop
        @click.stop="$emit('delete', url)"
      >
        <span class="icon-delete text-2xl" />
      </button>
    </div>
  </div>
</template>
