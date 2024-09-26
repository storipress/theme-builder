<script lang="ts">
import type { Component } from 'vue'
import { mdiCloudUploadOutline } from '@mdi/js'
import { BLOCKQUOTES } from '@storipress/templates/other-blocks/blockquote'
import { DROPCAPS } from '@storipress/templates/other-blocks/dropcap'
import Icon from 'shared/components/icon.vue'
import invariant from 'tiny-invariant'
import { dedent } from 'ts-dedent'

import { otherHelper } from '../../../store/modules/other'
import { SET_ELEMENT_VARIANT, SET_TEMPLATE } from '../../../store/modules/other/constants'
import Menu from './menu.vue'
import ReadMoreList from './read-more/list.vue'
import ReadMorePicture from './read-more/picture.vue'
import ReadMoreRight from './read-more/right.vue'
import { SubscribeBlock, SubscribeCenter, SubscribeQuote, SubscribeWide } from './subscribe'
import { COMPONENTS } from './templates'

interface BaseTemplateDescriptor {
  col: number
  card: 'square' | 'wide'
  name: string
}

interface TemplateComponent {
  name: string
  component: Component
}

interface StyleTemplateDescriptor extends BaseTemplateDescriptor {
  kinds: string[]
  component: string
  text: string
}

interface ComponentTemplateDescriptor extends BaseTemplateDescriptor {
  components: TemplateComponent[]
}

type TemplateDescriptor = StyleTemplateDescriptor | ComponentTemplateDescriptor

type Templates = Record<string, TemplateDescriptor | Record<string, TemplateDescriptor>>

const ITEMS: Templates = {
  article: {
    col: 2,
    card: 'wide',
    name: 'other',
    components: COMPONENTS,
  },

  page: {
    'drop-cap': {
      col: 3,
      card: 'square',
      name: 'dropcap',
      kinds: Object.keys(DROPCAPS),
      component: 'p',
      text: dedent`Article body lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos magni quo deleniti illum error ea officiis
      eveniet optio quisquam molestiae neque, explicabo voluptas excepturi quod, inventore, dolorum corporis non eaque!`,
    },
    quote: {
      col: 2,
      card: 'wide',
      name: 'blockquote',
      kinds: Object.keys(BLOCKQUOTES),
      component: 'blockquote',
      text: dedent`This is your quote block. Lorem ipsum, dolor sit amet consectetur adipisicing elit.`,
    },
    subscribe: {
      col: 2,
      card: 'wide',
      name: 'subscribe',
      components: [
        {
          name: 'quote',
          component: SubscribeQuote,
        },
        {
          name: 'center',
          component: SubscribeCenter,
        },
        {
          name: 'block',
          component: SubscribeBlock,
        },
        {
          name: 'wide',
          component: SubscribeWide,
        },
      ],
    },
    'read-more': {
      col: 3,
      card: 'square',
      name: 'read-more',
      components: [
        {
          name: 'picture',
          component: ReadMorePicture,
        },
        {
          name: 'right',
          component: ReadMoreRight,
        },
        {
          name: 'list',
          component: ReadMoreList,
        },
      ],
    },
  },
}

export default defineComponent({
  components: { Menu, Icon },
  data: () => ({
    menu: ['article'],
    mdiCloudUploadOutline,
  }),
  computed: {
    selectedKind(): string {
      if (this.menu[0] === 'page' && this.items) {
        return this.elements[this.items.name]
      }

      return this.template
    },
    items(): TemplateDescriptor | undefined {
      return this.menu.reduce((items, key) => items?.[key] as any, ITEMS) as any
    },

    ...otherHelper.mapState(['elements', 'template']),
  },

  methods: {
    setSelect(kind: string) {
      invariant(this.items, 'set select when not items')
      if (this.menu[0] === 'article') {
        if (this.selectedKind === kind) {
          return
        }

        this.setTemplate(kind)
      } else {
        this.setElementVariant({ [this.items.name]: kind })
      }
    },

    ...otherHelper.mapMutations({ setTemplate: SET_TEMPLATE, setElementVariant: SET_ELEMENT_VARIANT }),
  },
})
</script>

<template>
  <div class="element-picker">
    <Menu v-model="menu" class="sticky top-0 z-10 flex" />
    <template v-if="items">
      <div class="cards" :class="items.col === 3 ? ['grid-cols-2', '2xl:grid-cols-3'] : ['grid-cols-2']">
        <template v-if="items.component">
          <div
            v-for="kind in items.kinds"
            :key="kind"
            class="card"
            :class="[`card--${items.card}`, kind === selectedKind && 'card--active']"
            @click="setSelect(kind)"
          >
            <div class="card__content" :class="`${items.name}--${kind}`">
              <component :is="items.component">{{ items.text }}</component>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            v-for="item in items.components"
            :key="item.name"
            class="card"
            :class="[`card--${items.card}`, item.name === selectedKind && 'card--active']"
            @click="setSelect(item.name)"
          >
            <component :is="item.component" />
          </div>
        </template>
      </div>
    </template>
    <div v-else-if="menu[0] === 'custom'" class="text-light-grey-blue flex h-full flex-col items-center justify-center">
      <Icon class="h-40 w-40">{{ mdiCloudUploadOutline }}</Icon>
      <span>Drag template file</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.element-picker {
  @apply flex flex-col overflow-y-auto;

  .expanded & {
    @apply hidden;
  }
}

.cards {
  @apply mx-2 grid grid-flow-row-dense;

  gap: 1rem;
}

$card-size: 11.2rem;

.card {
  @apply shadow-1 overflow-hidden rounded-md bg-white transition-shadow;

  &--square {
    @apply p-10;

    height: $card-size;
    width: $card-size;
  }

  &--wide {
    @apply w-full p-5;
  }

  &:not(&--active):hover {
    @apply ring-2 ring-blue-300;
  }

  &--active {
    @apply ring-clear-blue ring-2;
  }

  &__content {
    @apply m-auto;
    @apply relative;

    .card--square & {
      width: 3 * $card-size;
      height: 40%;
    }
  }
}
</style>
