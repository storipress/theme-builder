<script lang="ts">
import { Template } from '@storipress/article'

export default Template.extend({})
</script>

<template>
  <ArticleBlock class="w-full bg-white">
    <section class="relative h-screen w-screen">
      <HeadlineImage class="absolute h-full w-full" :src="article.headline" />
      <div class="clip">
        <div class="w-128 fixed ml-8 mt-10">
          <Title :font-size="36" class="my-2">{{ article.title }}</Title>
          <Description>{{ article.description }}</Description>
        </div>
      </div>
    </section>
    <section class="w-192 mx-auto border-l">
      <div class="border-l py-10">
        <AuthorList align="center">By <Authors :authors="article.authors" /></AuthorList>
      </div>
      <ArticleContent :content="article.content" :variants="article.variants" />
    </section>
  </ArticleBlock>
</template>

<style lang="scss" scoped>
.clip {
  @apply absolute h-full w-full;

  clip: rect(0, auto, auto, 0);
}
</style>
