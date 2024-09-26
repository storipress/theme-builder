<script lang="ts">
export default defineComponent({
  props: {
    workspace: { type: Object, required: true },
  },
})
</script>

<template>
  <div class="w-1/4 p-5">
    <router-link class="text-clear-blue underline" :to="{ name: 'front-page', params: { clientID: workspace.id } }">
      {{ workspace.name }}
    </router-link>
  </div>
</template>
