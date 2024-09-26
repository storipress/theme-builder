<script lang="ts">
import { Template } from '@storipress/article'

export default Template.extend({})
</script>

<template>
  <ArticleBlock class="w-full bg-white">
    <section
      class="flex w-full flex-col-reverse items-center justify-between divide-y divide-y-reverse divide-black lg:flex-row lg:divide-y-0 lg:border-b lg:p-16"
    >
      <div class="mx-auto max-w-3xl grow">
        <TitleElement :font-size="36" :align="{ lg: 'center' }" class="my-2 lg:text-3xl xl:text-4xl">
          {{ article.title }}
        </TitleElement>
        <Description :align="{ lg: 'center' }">{{ article.blurb }}</Description>
      </div>
      <div class="w-full pb-4 lg:w-auto">
        <HeadlineImage class="mx-auto w-10/12 lg:w-auto" :src="article.headline" />
      </div>
    </section>
    <section class="w-9/10 lg:w-192 mx-auto">
      <div class="border-l py-10">
        <AuthorList bold>By <Authors :authors="article.authors" /></AuthorList>
      </div>
      <Date :time="article.time" />
      <ArticleContent class="space-x-4" :content="article.content" :variants="article.variants" />
    </section>
  </ArticleBlock>
</template>
