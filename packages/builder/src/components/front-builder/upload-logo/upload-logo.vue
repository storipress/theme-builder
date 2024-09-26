<script lang="ts">
import { Confirm } from '../../common/dialog'
import Transparency from './transparency.vue'

export default defineComponent({
  components: {
    Confirm,
    Transparency,
  },

  props: {
    value: Boolean,
  },
})
</script>

<template>
  <Confirm :logo="false" :buttons="['cancel', 'save']" :value="value" v-on="$listeners">
    <Transparency :class="$style.transparency">
      <slot />
    </Transparency>
  </Confirm>
</template>

<style lang="scss" module>
.transparency {
  width: 18.438rem;
  height: 18.438rem;
}
</style>
