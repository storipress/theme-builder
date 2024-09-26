<script lang="ts">
import type { O } from 'ts-toolbelt'
import type { Desk, Layout } from '../../../../api'
import { DEFAULT_TEMPLATE, PREVIEW_MAP } from '@storipress/templates/articles'
import { cloneDeep, noop } from 'lodash'

import { computed, defineComponent, inject, onMounted, ref, watch } from 'vue-demi'
import { deleteLayout, listDesks, listLayouts, postNewLayout, updateDeskLayout, updateLayout } from '../../../../api'
import { useRoute, useRouter } from '../../../../lib/hooks'
import { InlinePreview } from '../../article-previewer'

export default defineComponent({
  components: { InlinePreview },
  props: ['newLayout', 'deleteLayout'],

  setup(props, { emit }) {
    const isEditmode = ref(false)
    const layouts = ref<Layout[]>([])
    const changedLayouts = ref<Pick<Layout, 'id' | 'name'>[]>([])
    const desklists = ref<O.Update<Desk, 'layout', { id: string } | null>[]>([])
    const currentDesks = ref<{ desk: string; layout: string }[]>([])
    const router = useRouter()
    const route = useRoute()
    const deskTransitionDone = ref(false)

    watch(
      isEditmode,
      () => {
        deskTransitionDone.value = false
      },
      { flush: 'sync' },
    )

    const closeDialog = inject<() => void>('closeDialog', noop)

    async function getLayout() {
      const layoutArr = await listLayouts()
      layouts.value = cloneDeep(layoutArr).map((layout) => ({
        ...layout,
        preview: layout.preview
          ? layout.preview
          : {
              url: PREVIEW_MAP[layout.template],
            },
      }))
    }

    async function getDesks() {
      const deskArr = await listDesks()
      desklists.value = cloneDeep(deskArr)
    }
    async function newLayouthandler() {
      await postNewLayout(props.newLayout, DEFAULT_TEMPLATE)
      getLayout()
    }
    async function deleteLayouthandler() {
      if (props.deleteLayout) {
        deleteLayout(props.deleteLayout)
        getLayout()
      }
    }
    watch(() => props.newLayout, newLayouthandler)
    watch(() => props.deleteLayout, deleteLayouthandler)

    onMounted(() => {
      getLayout()
      getDesks()
    })

    return {
      isEditmode,
      layouts,
      changedLayouts,
      desklists,
      currentDesks,
      deskTransitionDone,

      currentLayoutId: computed(() => {
        return route.value.params.id
      }),

      toggleoEdit() {
        if (isEditmode.value) {
          for (const design of changedLayouts.value) {
            const { id, name } = design
            updateLayout({ id, name })
          }
          for (const { desk, layout } of currentDesks.value) {
            updateDeskLayout(desk, layout)
          }
          getLayout()
        }
        isEditmode.value = !isEditmode.value
      },
      getsettingIds(layout: string, deskId: string): void {
        const chosendesk = desklists.value.find((item) => item.id === deskId)
        if (!chosendesk) {
          return
        }
        chosendesk.layout = { id: layout }
        currentDesks.value.push({ desk: deskId, layout })
      },
      createEditlayout(layout: Layout) {
        changedLayouts.value.push({ id: layout.id, name: layout.name })
      },
      handleArticlesDesignClick(layoutId: string) {
        router.replace({ name: 'article', params: { clientID: route.value.params.clientID, id: layoutId } }).catch(noop)

        closeDialog()
      },
      handleClick(value: unknown) {
        emit('clicked', value)
      },
    }
  },
})
</script>

<template>
  <div class="article">
    <div class="mb-5 mt-4 text-left">
      <h1 class="text-brownish-grey text-base font-light">Article Designs</h1>
      <h2 class="text-brownish-grey text-sm">
        Design different default article designs for different desks to maximise engagement.
      </h2>
    </div>
    <div class="flex flex-wrap gap-4">
      <div v-for="(layout, index) in layouts" :key="layout.id" class="show-case-article">
        <div class="article-block" :class="currentLayoutId === layout.id && 'active'">
          <div
            class="article-image cursor-pointer overflow-hidden"
            role="button"
            @click="handleArticlesDesignClick(layout.id)"
          >
            <InlinePreview :template-name="layout.template" :data="layout.data" />
          </div>
          <transition name="fade">
            <div v-if="isEditmode" class="cover" @transition-end="deskTransitionDone = true">
              <div class="mb-3 mt-3 text-center text-sm text-white">Default for Desk</div>
              <div class="flex flex-row flex-wrap">
                <div
                  v-for="(desk, deskIndex) in desklists"
                  :key="desk.id"
                  class="options cursor-pointer"
                  :class="desk.layout && desk.layout.id === layout.id && 'active'"
                  :data-intercom-target="`Desk Button ${index}.${deskIndex}`"
                  v-bind="deskTransitionDone ? { 'data-intercom-target': `Desk Button ${index}.${deskIndex}` } : {}"
                  @click="getsettingIds(layout.id, desk.id)"
                >
                  {{ desk.name }}
                </div>
              </div>
            </div>
          </transition>
        </div>
        <div class="article-title" :class="isEditmode && 'active'">
          <input v-if="!isEditmode" v-model="layout.name" :disabled="true" />
          <input v-if="isEditmode" v-model.lazy="layouts[index].name" @change="createEditlayout(layouts[index])" />
        </div>
        <button
          v-if="isEditmode && layouts.length > 1"
          class="close-btn"
          @click="handleClick({ id: layout.id, isWarning: true, name: layout.name })"
        >
          <span class="icon-cross_thin" />
        </button>
      </div>
      <transition name="slide-fade">
        <div v-if="!isEditmode">
          <div class="show-case-article" @click="handleClick({ id: 'new', isWarning: false })">
            <div class="new-article cursor-pointer text-center">
              <button class="bg-warm-grey/30 rounded-full p-3">
                <span class="icon-plus text-[2.5rem]" />
              </button>
            </div>
            <div class="text-brownish-grey mx-auto mt-3 h-auto w-auto justify-self-center py-3 text-center text-xs">
              New Design
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="btn-wrapper">
      <button class="btn" data-intercom-target="Article Template Edit Button" @click="toggleoEdit">
        {{ isEditmode ? 'Save' : 'Edit' }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article {
  @apply font-lato relative flex h-full w-full flex-col overflow-y-scroll bg-transparent pb-8 pl-5 pr-8;

  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
    display: none;
  }

  .btn-wrapper {
    @apply sticky bottom-0 left-0 right-0 mx-auto mt-14 flex flex-1 items-end;
  }

  .btn {
    @apply shadow-2 mx-auto h-10 w-36 rounded-sm px-14 py-2 text-center text-base;

    color: #4c4c4c;
    background: #f0f0f0;
  }
}

.show-case-article {
  @apply relative mb-4 h-auto w-auto bg-white;

  min-width: 8.5rem;

  .article-block {
    @apply shadow-1 relative w-full overflow-hidden rounded-md transition-shadow;

    width: 9.375rem;
    height: 9.375rem;

    img {
      @apply absolute bottom-0 top-0 w-full;
    }

    &.active,
    &:hover {
      @apply ring-clear-blue ring-2;
    }

    &.active img {
      @apply opacity-50;
    }
  }

  .new-article {
    @apply relative w-full overflow-hidden rounded-md transition-shadow;
    @apply shadow-1;

    height: 9.375rem;

    button {
      margin: 30% auto auto;
    }

    &:hover {
      @apply ring-clear-blue ring-2;
    }
  }

  .cover {
    @apply absolute bottom-0 top-0 h-full w-full overflow-y-scroll px-2.5 py-1 opacity-100;

    background-color: rgb(0 0 0 / 65%);

    // animation: showcover 0.5s ease-in 0s forwards;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      width: 0;
      display: none;
    }

    .options {
      @apply mb-1 mr-1 rounded-sm border border-white px-2 py-1 text-center text-white;

      font-size: 0.68rem;

      &.active {
        @apply text-clear-blue border-clear-blue;
      }

      &:hover {
        background: #797979;
      }
    }

    .new-case-article {
      @apply relative mb-4 h-auto w-auto bg-white;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.65s ease;
  }

  .fade-enter,
  .fade-leave-to {
    @apply top-full opacity-30;
  }

  .article-title {
    @apply mx-auto mt-3 flex h-auto w-5/6 rounded-md border border-transparent px-1.5 py-1 text-center text-xs;

    &.active {
      @apply border-clear-blue;
    }

    input {
      @apply text-brownish-grey relative w-full bg-transparent text-center text-xs outline-none disabled:opacity-100;
      @apply resize-none align-bottom;
    }
  }

  .close-btn {
    @apply absolute -right-2 -top-2 flex items-center justify-center;
    @apply shadow-1 rounded-full bg-white p-1 text-xs leading-none transition-shadow;

    &:hover {
      @apply ring-1 ring-gray-200;
    }
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.35s ease;
}

.slide-fade-enter,
.slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  @apply opacity-0;

  transform: translateY(10px);
}
</style>
