<script lang="ts" setup>
import type { State as ArticleState } from '../../../store/modules/article'
import type { TemplateDescriptor } from './definition'
import invariant from 'tiny-invariant'
import { computed, ref } from 'vue'
import { useMutations, useState } from 'vuex-hooks'
import { SET_ELEMENT_VARIANT, SET_TEMPLATE } from '../../../store/modules/article/constants'
import { ITEMS } from './definition'
import Menu from './menu.vue'
import TemplatePicker from './template-picker.vue'

const menu = ref(['article'])
const { elements, template } = useState<ArticleState>('article')
const { [SET_TEMPLATE]: setTemplate, [SET_ELEMENT_VARIANT]: setElementVariant } = useMutations('article')

const items = computed((): TemplateDescriptor | undefined => {
  if (menu.value[0] !== 'page') {
    return undefined
  }
  return ITEMS[menu.value[1]]
})

const selectedKind = computed((): string => {
  if (menu.value[0] === 'page' && items.value) {
    return elements.value[items.value.name as 'dropcap' | 'blockquote']
  }

  return template.value
})

function setSelect(kind: string) {
  if (menu.value[0] === 'article') {
    if (selectedKind.value === kind) {
      return
    }

    setTemplate(kind)
  } else {
    invariant(items.value, 'set select when no items')
    setElementVariant({ [items.value.name]: kind })
  }
}

const templateModel = computed({
  get() {
    return template.value
  },
  set(tpl: string) {
    setSelect(tpl)
  },
})
</script>

<template>
  <div class="element-picker">
    <Menu v-model="menu" class="sticky top-0 flex" />
    <template v-if="items">
      <div
        class="cards"
        :class="items.col === 3 ? ['grid-cols-2', '2xl:grid-cols-3'] : ['grid-cols-2']"
        data-intercom-target="Template Picker Body"
      >
        <template v-if="items.component">
          <div
            v-for="kind in items.kinds"
            :key="kind"
            class="card"
            :class="[`card--${items.card}`, kind === selectedKind && 'card--active']"
            @click="setSelect(kind)"
          >
            <div class="card__content" :class="`${items.name}--${kind}`">
              <div class="main-content">
                <component :is="items.component">{{ items.text }}</component>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            v-for="item in items.components"
            :key="item.name"
            class="card"
            :class="[`card--${items.card}`, item.name === selectedKind && 'card--active']"
            role="button"
            @click="setSelect(item.name)"
          >
            <component :is="item.component" />
          </div>
        </template>
      </div>
    </template>
    <TemplatePicker
      v-else-if="menu[0] === 'article'"
      v-model="templateModel"
      data-intercom-target="Template Picker Body"
    />
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
  @apply shadow-1 cursor-pointer overflow-hidden rounded-md bg-white transition-shadow;

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
