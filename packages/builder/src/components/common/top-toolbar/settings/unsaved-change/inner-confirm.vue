<script lang="ts">
import type { PropType } from 'vue-demi'
import { defineComponent } from 'vue-demi'

import Dialog from './inner-dialog.vue'

export default defineComponent({
  components: { Dialog },
  props: {
    buttons: {
      type: Array as PropType<readonly string[]>,
      default: () => ['Cancel', 'OK'],
    },
    logo: {
      type: Boolean,
      default: true,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<template>
  <Dialog v-if="value" center>
    <div class="shadow-1 w-128 rounded bg-white" @click.stop>
      <slot />
      <slot name="buttons">
        <div class="divide-warm-grey border-warm-grey flex divide-x border-t">
          <button
            v-for="btn in buttons"
            :key="btn"
            class="text-brownish-grey block w-full py-3 uppercase"
            @click="$emit('click', btn)"
          >
            {{ btn }}
          </button>
        </div>
      </slot>
    </div>
  </Dialog>
</template>
