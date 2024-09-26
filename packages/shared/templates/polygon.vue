<script lang="ts">
import { Template } from '@storipress/article'

export default Template.extend({})
</script>

<template>
  <ArticleBlock class="w-full bg-white">
    <section>
      <HeadlineImage class="w-full" :src="article.headline" />
    </section>
    <section class="mx-auto max-w-3xl p-4">
      <Desk uppercase align="center">{{ article.desk }}</Desk>
      <Title :font-size="36" align="center" class="my-2">{{ article.title }}</Title>
      <Description align="center">{{ article.description }}</Description>
      <AuthorList align="center">By <Authors :authors="article.authors" /></AuthorList>
    </section>
    <section class="md:w-192 mx-auto">
      <ArticleContent :content="article.content" :variants="article.variants" />
    </section>
  </ArticleBlock>
</template>
