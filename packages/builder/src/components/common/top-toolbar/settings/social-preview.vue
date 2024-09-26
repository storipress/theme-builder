<script lang="ts">
import { ResponsiveImage } from '@storipress/elements/common'
import { joinURL } from 'ufo'
import { computed, defineComponent } from 'vue'

import ShowCase from './show-case.vue'

export default defineComponent({
  components: {
    ShowCase,
    ResponsiveImage,
  },

  props: {
    siteName: {
      type: String,
      required: true,
    },
    siteURL: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    appendSiteName: {
      type: Boolean,
    },
    path: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  setup(props) {
    const fullURL = computed(() => {
      return joinURL(props.siteURL, props.path)
    })

    return {
      fullURL,
    }
  },
})
</script>

<template>
  <ShowCase>
    <div v-if="image" class="flex h-48 w-full items-stretch overflow-hidden rounded">
      <ResponsiveImage class="m-auto mb-2 h-auto w-full self-stretch" :src="image" />
    </div>
    <div class="flex h-auto w-full flex-col text-left">
      <div class="block w-11/12">
        <h3 class="title-black truncate text-lg leading-6">
          {{ title }}
          <span v-if="appendSiteName">- {{ siteName }}</span>
        </h3>
      </div>
      <div class="flex-wrap">
        <h2 class="title-black text-xs">{{ description }} &nbsp;</h2>
      </div>
      <div>
        <p class="title-dark-grey text-xs">
          {{ fullURL }}
        </p>
      </div>
    </div>
  </ShowCase>
</template>

<style lang="scss" scoped>
.title-black {
  color: #212121;
}

.title-dark-grey {
  color: #5f6368;
}
</style>
