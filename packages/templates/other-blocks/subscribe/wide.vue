<template>
  <SubscribeForm>
    <p>Like <span class="italic">The Atlantic</span>?</p>
    <div class="flex space-x-1">
      <SubscribeEmail class="flex-grow" placeholder="Enter your email" />
      <button class="bg-black px-4 py-1 text-white">Sign up</button>
    </div>
  </SubscribeForm>
</template>

<script lang="ts">
import { SubscribeEmail, SubscribeForm } from '@storipress/article'

export default Vue.extend({ components: { SubscribeEmail, SubscribeForm } })
</script>
