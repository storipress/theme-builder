<script lang="ts">
import type { PropType } from 'vue'
import Vue from 'vue'

import { LinkElement } from '../common'
import { styleProps } from './style-props'
import TextElement from './text-element.vue'

interface Author {
  name: string
  url: string
}

export default Vue.extend({
  components: { LinkElement, TextElement },

  props: {
    kind: {
      type: String,
      required: true,
    },
    blockType: {
      type: String,
    },
    component: {
      type: String,
      default: 'p',
    },
    authorComponent: {
      type: String,
      default: 'span',
    },
    authors: {
      type: Array as PropType<Author[]>,
      required: true,
    },
    separator: {
      type: String,
      default: ', ',
    },
    authorClass: {
      type: String,
    },
    separatorClass: {
      type: String,
    },
    preposition: {
      type: String,
      default: '',
    },
    ...styleProps,
  },

  computed: {
    textProps() {
      const { component, authorComponent, authors, authorClass, separator, separatorClass, ...rest } = this.$props
      return {
        component: authorComponent,
        ...rest,
      }
    },
  },
})
</script>

<template>
  <TextElement v-if="authors.length > 0" v-bind="textProps">
    {{ preposition }}
    <template v-for="(author, i) of authors">
      <template v-if="i === 0" /><span v-else-if="i === authors.length - 1" :key="`${i}-sep`" :class="separatorClass">
        and </span
      ><span v-else :key="`${i}-sep`" :class="separatorClass">{{ separator }}</span>
      <LinkElement :key="i" :href="author.url" :class="authorClass">
        {{ author.name }}
      </LinkElement>
    </template>
  </TextElement>
</template>
