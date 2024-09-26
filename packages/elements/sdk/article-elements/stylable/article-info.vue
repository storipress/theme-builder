<script lang="ts">
import { Element } from './base'

export default Element.extend({
  computed: {
    article() {
      const { elements, ...article } = this.element
      return { ...article, deskUrl: '#' }
    },

    socials() {
      return {
        facebook: '#',
        twitter: '#',
        email: '#',
      }
    },
  },
})
</script>

<template>
  <div>
    <slot :article="article" :socials="socials" />
  </div>
</template>
