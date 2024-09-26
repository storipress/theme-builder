<template>
  <SubscribeForm class="bg-clear-blue bg-opacity-25 p-2">
    <h3 class="text-sm font-bold">Sign Up to our newsletter</h3>
    <p>Updates on everything new at Aeon</p>
    <div class="flex">
      <SubscribeEmail class="border border-black" placeholder="Your email address" />
      <label>
        <input type="checkbox" />
        Daily
      </label>
      <label>
        <input type="checkbox" />
        Weekly
      </label>
    </div>
    <div class="flex">
      <button class="bg-red-700 px-2 py-1 text-white">Subscribe →</button>
      <p>See out newsletter privacy policy <span class="underline">here</span></p>
    </div>
  </SubscribeForm>
</template>

<script lang="ts">
import { SubscribeEmail, SubscribeForm } from '@storipress/article'
import Vue from 'vue'

export default Vue.extend({ components: { SubscribeEmail, SubscribeForm } })
</script>
