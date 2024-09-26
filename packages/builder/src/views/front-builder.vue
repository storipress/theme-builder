<script lang="ts">
import { defineComponent } from 'vue-demi'
import { useActions } from 'vuex-hooks'

import { FrontPage } from '../components/front-builder'
import { LoadingMask, useLoadingStore } from '../components/loading'
import { frontHelpers } from '../store/modules/front'

export default defineComponent({
  components: { FrontPage, LoadingMask },
  props: { clientID: String },
  methods: {
    ...frontHelpers.mapActions(['fetchDesign']),
  },
  setup() {
    const { fetchDesign } = useActions('front')
    const loadingStore = useLoadingStore()
    loadingStore.waitPromise(
      fetchDesign(),
      'Fail to load your front page design. Please check your network connection and try again',
    )
  },
})
</script>

<template>
  <LoadingMask>
    <FrontPage />
  </LoadingMask>
</template>
