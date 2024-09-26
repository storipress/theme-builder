<script lang="ts">
import { defineComponent } from 'vue-demi'

import Blockquote from './blockquote.vue'
import Content from './content.vue'
import Header1 from './header1.vue'
import Header2 from './header2.vue'
import Paragraph from './paragraph.vue'

export default defineComponent({
  components: { Paragraph, Header1, Header2, Blockquote, Content },
})
</script>

<template>
  <Content>
    <Paragraph :order="0" />
    <Header1 :font-size="32" />
    <Paragraph :order="1" />
    <Blockquote />
    <Paragraph :order="2" />
    <Header2 :font-size="28" />
    <Paragraph :order="3" />
  </Content>
</template>
