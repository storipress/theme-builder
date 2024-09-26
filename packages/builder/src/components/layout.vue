<script lang="ts">
import { SET_PREVIEW } from '../store'
import { Toolbar } from './common/top-toolbar'

const isIFrame = window.self !== window.top

export default defineComponent({
  components: { Toolbar },

  computed: {
    preview: {
      get(): string {
        return this.$store.state.preview
      },

      set(val: string) {
        this.$store.commit(SET_PREVIEW, val)
      },
    },
    layoutClass() {
      const classes = ['flex', 'flex-col']
      if (!isIFrame) classes.push('w-screen', 'h-screen')

      return classes.join(' ')
    },

    showChild(): unknown {
      return this.hideToolbar || this.token
    },

    token(): string | null {
      return this.$store.state.auth.token
    },

    hideToolbar(): boolean {
      const name = this.$route.name ?? ''
      return (
        !this.$store.state.clientID ||
        name === 'workspaces' ||
        name === 'internal' ||
        name === 'login' ||
        name.includes('preview')
      )
    },
  },
})
</script>

<template>
  <div :class="[layoutClass, preview]">
    <Toolbar v-if="!hideToolbar" v-model="preview" class="z-30" />
    <slot v-if="showChild" />
  </div>
</template>
