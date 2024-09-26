<script lang="ts">
import type { State } from '../../../store/modules/front'
import { PortalTarget } from 'portal-vue'
import { computed, defineComponent, provide } from 'vue-demi'

import { useState } from 'vuex-hooks'
import { useRoute } from '../../../lib/hooks'
import { BlockIdProvider } from './block-id-provider'
import { BlockProvider } from './block-provider'

export default defineComponent({
  components: { BlockProvider, PortalTarget, BlockIdProvider },

  props: {
    name: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const state = useState<State>('front')
    const heroId = computed(() => state.blocks.value[0])
    // FIXME: this will cause bug if there have a second menu, but this is not able to solve in vue 2
    // as this will need teleport to fix the issue
    provide('portal', props.name)

    const route = useRoute()

    return {
      enable: computed(() => {
        return route.value.name?.endsWith('preview') ?? false
      }),
      heroId,
    }
  },
})
</script>

<template>
  <!-- portal-vue will break the original relationship between parent and child -->
  <!-- we must provider the injection again here -->
  <!-- using key could help use update the provided value -->
  <BlockIdProvider v-if="enable && heroId" :key="heroId" :block-id="heroId">
    <BlockProvider>
      <!-- force bg transparent or it will be put on the block background -->
      <PortalTarget class="!bg-transparent" :class="`b-${heroId}`" :name="name" slim />
    </BlockProvider>
  </BlockIdProvider>
</template>
