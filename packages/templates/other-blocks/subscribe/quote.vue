<template>
  <SubscribeForm class="relative flex items-center justify-center">
    <div class="border-clear-blue absolute inset-0 m-auto h-4/5 w-4/5 border-2"></div>
    <div class="h-full w-3/5 bg-white">
      <h3 class="font-bold">Join the Newsletter</h3>
      <p class="text-clear-blue font-bold">Original Reporting. Fearless Journalism. Delivered to you.</p>
      <div>
        <span class="text-clear-blue font-bold">I'm in</span>
        <SubscribeEmail class="inline" />
      </div>
    </div>
  </SubscribeForm>
</template>

<script lang="ts">
import { SubscribeEmail, SubscribeForm } from '@storipress/article'
import Vue from 'vue'

export default Vue.extend({ components: { SubscribeEmail, SubscribeForm } })
</script>
