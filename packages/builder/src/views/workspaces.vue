<script lang="ts">
import type { Workspace as WorkspaceObject } from '../api'
import { getWorkspaces } from '../api'
import { Workspace } from '../components/workspaces'

export default defineComponent({
  components: { Workspace },

  data: () => ({ workspaces: [] as WorkspaceObject[] }),

  async created() {
    this.workspaces = await getWorkspaces()

    // redirect if only a single workspace
    if (this.workspaces.length === 1) {
      this.$router.replace({ name: 'front-page', params: { clientID: this.workspaces[0].id } })
    }
  },
})
</script>

<template>
  <div class="shadow-2 flex flex-wrap divide-x-2">
    <Workspace v-for="workspace of workspaces" :key="workspace.id" :workspace="workspace" />
  </div>
</template>
