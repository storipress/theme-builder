<script lang="ts">
import { Fallback, TEMPLATE_MAP } from '@storipress/templates/articles'
import { computed, defineComponent } from 'vue-demi'

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    return {
      template: computed(() => TEMPLATE_MAP[props.name] ?? Fallback),
    }
  },
})
</script>

<template>
  <component :is="template" />
</template>
