<template>
  <SubscribeForm
    class="jsutify-center flex h-full flex-col items-center border-b border-t border-black py-3"
    v-slot="{ message }"
  >
    <h3 class="font-bold uppercase text-red-500">stay in touch</h3>
    <p>Get the Cut newsletter delvered daily</p>
    <div class="flex w-4/5">
      <SubscribeEmail placeholder="email address" class="flex-grow" />
      <button class="bg-black uppercase text-white" type="submit">sign up</button>
    </div>
    <p class="text-red-500">{{ message }}</p>
  </SubscribeForm>
</template>
<script lang="ts">
import { SubscribeEmail, SubscribeForm } from '@storipress/article'
import Vue from 'vue'

export default Vue.extend({ components: { SubscribeForm, SubscribeEmail } })
</script>
