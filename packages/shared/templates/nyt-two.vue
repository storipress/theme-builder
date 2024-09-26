<script lang="ts">
import { Template } from '@storipress/article'

export default Template.extend({})
</script>

<template>
  <ArticleBlock class="w-full bg-white">
    <HeaderBlock class="nyt-two-header bg-black">
      <div class="md:w-1/2 md:self-end">
        <div class="flex border-b border-white">
          <Desk bold color="ffffff" class="mr-4">{{ article.desk }}</Desk>
          <Date color="ffffff" format="MMMM dd,yyyy" :time="article.time" />
        </div>
        <TitleElement :font-size="{ xs: 36, md: 30, lg: 36 }" color="ffffff" class="my-2">
          {{ article.title }}
        </TitleElement>
        <AuthorList color="ffffff">By <Authors :authors="article.authors" /></AuthorList>
      </div>
      <div class="w-full lg:w-2/3 xl:w-auto">
        <HeadlineImage class="mx-auto" :src="article.headline" />
      </div>
    </HeaderBlock>
    <section class="w-128 mx-auto">
      <ArticleContent :content="article.content" :variants="article.variants" />
    </section>
  </ArticleBlock>
</template>

<style lang="scss" scoped>
.nyt-two-header {
  @apply mb-16 flex w-full flex-col-reverse items-center justify-between;

  padding: 30px;

  @screen md {
    @apply flex-row;
  }
}
</style>
