<script lang="ts">
import type { VueConstructor } from 'vue'
import type { Integration } from '../../../generated/graphql'
import Vue from 'vue'

import { mapState } from 'vuex'

interface Refs {
  menu: HTMLElement[]
  subMenu: HTMLElement[]
}

type withRefs = VueConstructor<Vue & { $refs: Refs }>

interface Item {
  name: string
  text: string
}

interface ItemWithOffset extends Item {
  offset: number
}

export default (Vue as withRefs).extend({
  props: {
    value: {
      type: Array as { new (): string[] },
      default: (): string[] => ['page', 'drop-cap'],
    },
  },

  data: () => ({
    pageX: 0,
    subMenuOffset: [0, 0, 0, 0],
  }),

  computed: {
    menu: {
      get(): string {
        return this.value[0]
      },
      set(val: string) {
        const subMenu = this.menuItems.find(({ name }) => name === val)?.items
        if (subMenu) {
          this.$emit('input', [val, subMenu[0].name])
        } else {
          this.$emit('input', [val])
        }
      },
    },

    sub: {
      get(): string | undefined {
        return this.value[1]
      },
      set(val: string) {
        this.$emit('input', [this.menu, val])
      },
    },

    menuItems() {
      return [
        {
          name: 'article',
          icon: 'icon-templates',
        },
        {
          name: 'page',
          icon: 'icon-page_elements',
          items: [
            {
              name: 'drop-cap',
              text: 'Drop Cap',
            },
            {
              name: 'quote',
              text: 'Quote',
            },
            ...(this.isMailchimpActived
              ? [
                  {
                    name: 'subscribe',
                    text: 'Subscribe',
                  },
                ]
              : []),
            // {
            //   name: 'read-more',
            //   text: 'Read More',
            // },
          ],
        },
        {
          name: 'custom',
          icon: 'icon-upload',
        },
      ]
    },

    subMenu(): Item[] | undefined {
      const selected = this.menu
      return this.menuItems.find(({ name }) => name === selected)?.items
    },

    subMenuWithOffset(): ItemWithOffset[] | undefined {
      return this.subMenu?.map((item, i) => ({
        ...item,
        offset: this.subMenuOffset[i] ?? 0,
      }))
    },

    isMailchimpActived(): boolean {
      return !!this.integrations.find((item: Integration) => item.key === 'mailchimp')?.activated_at
    },

    ...mapState({
      integrations: (state: any) => state.integrations,
    }),
  },

  watch: {
    subMenu: {
      async handler(val: unknown[] | null) {
        if (val) {
          await Vue.nextTick()
          this.computeItemOffsets()
        }
      },
      immediate: true,
    },
  },

  methods: {
    computeItemOffsets() {
      const selected = this.menu
      const index = this.menuItems.findIndex(({ name }) => name === selected)
      const $el = this.$refs.menu[index]
      this.pageX = $el.offsetLeft + $el.offsetWidth / 2

      // 12 is left margin
      this.subMenuOffset = this.$refs.subMenu.map(($el) => $el.offsetLeft + $el.offsetWidth / 2 + 12)
    },
  },
})
</script>

<template>
  <div class="menu mx-2 flex flex-wrap text-sm">
    <div class="menu__tabs shadow-1 my-2 mr-2 rounded-sm bg-white">
      <button
        v-for="item in menuItems"
        :key="item.name"
        ref="menu"
        class="menu__tab hover:bg-white-grey h-8 cursor-pointer p-2 transition-colors"
        :class="menu === item.name && 'active'"
        @click="menu = item.name"
      >
        <span class="flex items-center justify-center">
          <i :class="item.icon" />
        </span>
      </button>
    </div>

    <div v-if="subMenu" class="menu__subtabs shadow-1 my-2 rounded-sm bg-white">
      <button
        v-for="(item, idx) in subMenu"
        :key="`${menu}_${item.name}`"
        ref="subMenu"
        class="menu__menu__subtab hover:bg-white-grey h-8 cursor-pointer px-3 py-2 uppercase leading-none transition-colors"
        :class="[sub === item.name && 'active', idx && 'border-l']"
        @click="sub = item.name"
      >
        {{ item.text }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  color: #4c4c4c;

  .active {
    @apply bg-white-grey;
  }
}
</style>
