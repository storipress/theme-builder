<script lang="ts">
import { defineComponent } from 'vue-demi'

import DeadComputer from '../assets/dead-computer.svg'
import FullLogo from '../assets/full-logo.svg'

export default defineComponent({
  components: { FullLogo, DeadComputer },
})
</script>

<template>
  <div class="absolute inset-0 z-30 h-full w-full bg-white">
    <div class="p-8">
      <FullLogo />
    </div>
    <div class="absolute inset-0 flex h-full w-full items-center justify-center">
      <div class="flex items-center space-x-16">
        <DeadComputer />
        <div class="space-y-4">
          <h1 class="text-5xl font-light">Use Chrome or Firefox to use the site builder.</h1>
          <h2 class="text-2xl font-bold">Storipress doesn’t currently support Safari :(</h2>
        </div>
      </div>
    </div>
  </div>
</template>
