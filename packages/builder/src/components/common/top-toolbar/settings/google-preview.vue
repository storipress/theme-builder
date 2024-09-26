<script lang="ts">
import { joinURL } from 'ufo'
import { computed, defineComponent } from 'vue'

import ShowCase from './show-case.vue'

export default defineComponent({
  components: {
    ShowCase,
  },

  props: {
    title: {
      type: String,
      default: 'Title Tag',
    },
    siteName: {
      type: String,
      required: true,
    },
    appendSiteName: {
      type: Boolean,
    },
    siteURL: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    description: {
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
    <div class="flex h-auto w-full flex-col text-left">
      <div class="block w-11/12">
        <h3 class="title-blue truncate text-xl leading-6">
          {{ title }}
          <span v-if="appendSiteName">- {{ siteName }}</span>
        </h3>
      </div>
      <div>
        <p class="title-green text-sm">
          {{ fullURL }}
        </p>
      </div>
      <div>
        <h2 class="title-dark-grey overflow-hidden text-ellipsis whitespace-nowrap text-sm">
          {{ description }}
        </h2>
      </div>
    </div>
  </ShowCase>
</template>

<style lang="scss" scoped>
.title-dark-grey {
  color: #5f6368;
}

.title-blue {
  color: #1a0dab;
}

.title-green {
  color: #006621;
}
</style>
