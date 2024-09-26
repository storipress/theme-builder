<script lang="ts">
import { mdiEmail, mdiFacebook, mdiTwitter } from '@mdi/js'
import {
  ArticleBlock,
  AuthorList,
  AuthorName,
  Blockquote,
  Content,
  Date,
  Description,
  Header,
  Header1,
  Header2,
  Paragraph,
  TitleElement,
} from '@storipress/elements/article-elements'
import Icon from 'shared/components/icon.vue'

export default defineComponent({
  components: {
    Icon,
    ArticleBlock,
    AuthorList,
    AuthorName,
    Blockquote,
    Content,
    Date,
    Description,
    Header,
    Header1,
    Header2,
    Paragraph,
    TitleElement,
  },

  data: () => ({
    mdiEmail,
    mdiFacebook,
    mdiTwitter,
  }),
})
</script>

<template>
  <ArticleBlock>
    <Header class="mx-auto mb-12 w-2/3">
      <TitleElement :font-size="36" bold uppercase>
        An Ode to Nothingness: Inner Dialogues on the Meaning of Absolutely Nothing.
      </TitleElement>
      <Description class="mb-12">
        What is nothingness if nothingness is nothing? Sometimes one has to enquire as to the true meaning of this
        question; but other times, one must reflect introspectively to discover its true meaning.
      </Description>
      <AuthorList align="center"> By <AuthorName underline>Helga Smith</AuthorName> </AuthorList>
      <Date align="center" format="MMM-dd-yyyy hh:mma O" />
      <div class="mt-1 flex justify-center space-x-3">
        <Icon class="h-6 w-6">{{ mdiFacebook }}</Icon>
        <Icon class="h-6 w-6">{{ mdiTwitter }}</Icon>
        <Icon class="h-6 w-6">{{ mdiEmail }}</Icon>
      </div>
    </Header>
    <hr class="mx-auto w-1/3 border-t-2 border-black" />
    <Content class="mx-auto w-3/5 space-y-4">
      <Paragraph :order="0" />
      <Header1 :font-size="32" />
      <Paragraph :order="1" />
      <Blockquote />
      <Paragraph :order="2" />
      <Header2 :font-size="28" />
      <Paragraph :order="3" />
    </Content>
  </ArticleBlock>
</template>
