<script lang="ts">
import { PreviewContainer } from '../components/article-preview'
import SizeObserver from '../components/common/size-observer.vue'
import { articleHelpers, SET_HEIGHT } from '../store/modules/article/constants'

export default defineComponent({
  components: { PreviewContainer, SizeObserver },

  computed: {
    initialized(): boolean {
      return this.$store.state?.['sync-plugin']?.initialized || false
    },

    height: {
      get(): number {
        // actually whatever the value here is ok
        return this.articleHeight
      },

      set(val: number) {
        this.setHeight(val)
      },
    },

    ...articleHelpers.mapState({ articleHeight: 'height' }),
  },

  methods: articleHelpers.mapMutations({ setHeight: SET_HEIGHT }),
})
</script>

<template>
  <SizeObserver v-model="height"><PreviewContainer v-if="initialized" /></SizeObserver>
</template>
