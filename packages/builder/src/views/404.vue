<script>
import { defineComponent } from 'vue-demi'

import NotFoundImage from '../assets/404.svg'
import FullLogo from '../assets/full-logo.svg'

export default defineComponent({
  name: 'NotFoundPage',
  components: {
    NotFoundImage,
    FullLogo,
  },
})
</script>

<template>
  <div class="not-found-page bg-white-grey flex h-screen flex-col justify-between pt-16 md:flex-row md:px-14">
    <div class="error-message font-lato text-black-three px-4 md:w-1/2 md:p-0">
      <p class="mt-4 text-lg font-light md:mt-16 md:text-xl">Uh oh… we can’t find that page.</p>
      <h1 class="mt-4 text-7xl font-light leading-tight md:text-9xl">ERROR<br />404</h1>
    </div>
    <div class="decoration-image md:w-1/2">
      <NotFoundImage class="mt-auto w-full md:h-full md:w-auto" />
    </div>
    <div class="logo fixed bottom-4 left-4 md:bottom-9 md:left-20 md:scale-150">
      <router-link to="/">
        <FullLogo />
      </router-link>
    </div>
  </div>
</template>
