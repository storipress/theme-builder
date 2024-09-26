<script lang="ts">
import type { Node } from 'prosemirror-model'
import type { PropType, WritableComputedRef } from 'vue-demi'
import type { BookmarkMeta, EmbedMeta } from '../../core/api'
import * as Sentry from '@sentry/vue'
import { NodeViewWrapper } from '@tiptap/vue-2'
import { raf } from 'shared/utils'
import { isUri } from 'valid-url'

import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue-demi'
import { getAPI } from '../../core/api'
import Bookmark from './bookmark.vue'
import { getIframe, putIframe } from './iframe-recycler'
import { load } from './iframely'
import Instagram from './instagram.svg'
import Soundcloud from './soundcloud.svg'

const AVAILABLE_ICONS = new Set(['twitter', 'instagram', 'vimeo', 'spotify', 'soundcloud', 'youtube', 'codepen'])

const DESCRIPTIONS: Record<string, string> = {
  twitter: 'Paste tweet URL',
  instagram: 'Paste Instagram URL',
  vimeo: 'Paste Vimeo video URL',
  spotify: 'Paste Spotify song or playlist URL',
  soundcloud: 'Paste Soundcloud song URL',
  youtube: 'Paste YouTube video URL',
  codepen: 'Paste Codepen URL',
  bookmark: 'URL of bookmark card',
}

function safeParseMeta(meta: string | null) {
  try {
    return meta ? JSON.parse(meta) : null
  } catch (error) {
    Sentry.captureException(new Error('invalid meta', { cause: error as Error }), (scope) => {
      scope.setContext('meta', meta as any)
      return scope
    })
    return null
  }
}

export default defineComponent({
  name: 'ResourceView',
  components: { Bookmark, Instagram, Soundcloud, NodeViewWrapper },
  props: {
    editor: {
      type: Object as PropType<import('@tiptap/core').Editor>,
      required: true,
    },
    node: {
      type: Object as PropType<Node<any>>,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
    extension: {
      type: Object as PropType<import('@tiptap/core').Node<any>>,
      required: true,
    },
    getPos: {
      type: Function as PropType<() => number>,
      required: true,
    },
    updateAttributes: {
      type: Function as PropType<(attributes: Record<string, any>) => void>,
      required: true,
    },
    deleteNode: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup(props) {
    const container = ref<HTMLElement>()
    const urlInput = ref<HTMLInputElement>()
    const input = ref('')
    const html = ref('')

    function bindAttr(key: string): WritableComputedRef<string> {
      return computed({
        get() {
          return props.node.attrs[key]
        },
        set(val: string) {
          return props.updateAttributes({ [key]: val })
        },
      })
    }

    const url = bindAttr('url')
    const type = bindAttr('type')
    const target = bindAttr('target')
    const meta = computed({
      get(): BookmarkMeta {
        return safeParseMeta(props.node.attrs.meta)
      },
      set(meta: BookmarkMeta) {
        props.updateAttributes({ meta: JSON.stringify(meta) })
      },
    })
    const bookmark = computed(() =>
      url.value && type.value === 'bookmark' && meta.value ? (meta.value as BookmarkMeta) : null
    )
    const embed = computed(() => (url.value && type.value === 'embed' && meta.value ? (meta.value as EmbedMeta) : null))

    watch(
      url,
      async (url, old) => {
        if (url && url !== old && url !== meta.value?.url) {
          const api = getAPI()
          // TODO: feedback for invalid url
          meta.value = await api.getBookmarkMeta(url)
        }
      },
      { immediate: true }
    )

    watch(
      embed,
      async (embed, old) => {
        if (embed && embed.html !== old?.html) {
          // since ProseMirror may recreate NodeView, we need to manage iframe by ourseleves to prevent unnecessary reload
          // unnecessary reload will eat up a lot of resource and may cause crash
          // here is the magic, we check if we already have iframe, we don't update the html, we inject the old iframe element instead
          const $iframe = getIframe(props.node.attrs.meta)
          if (!$iframe) {
            html.value = embed.html
          }
          // a tick for vue update
          await nextTick()

          const $container = container.value
          if ($container && $iframe) {
            $container.append($iframe)
          }

          // anthor tick for dom update
          await raf()
          load()
        }
      },
      { immediate: true }
    )

    function setSelection() {
      props.editor.commands.setNodeSelection(props.getPos())
    }

    onMounted(async () => {
      await nextTick()
      // process exisiting embed
      if (embed.value) {
        load()
        input.value = embed.value.url
        return
      }
      if (bookmark.value) {
        input.value = bookmark.value.url
        return
      }
      setSelection()
      urlInput.value?.focus()
    })

    onBeforeUnmount(() => {
      const $container = container.value
      if ($container && $container.firstElementChild) {
        putIframe(props.node.attrs.meta, $container.firstElementChild as HTMLElement)
      }
    })

    return {
      container,
      urlInput,

      html,
      input,
      url,
      type,
      target,
      meta,
      caption: bindAttr('caption'),
      icon: computed(() => (AVAILABLE_ICONS.has(target.value) ? `icon-${target.value}` : 'icon-bookmark')),
      description: computed(() => DESCRIPTIONS[target.value] ?? 'Paste URL'),
      bookmark,
      embed,

      handleSubmit() {
        if (isUri(input.value)) {
          url.value = input.value
        }
      },
      setSelection,
    }
  },
})
</script>

<template>
  <NodeViewWrapper
    class="resource interactive-node clear-both"
    :class="[!caption && 'no-caption', selected && 'has-focus']"
    data-format="resource"
    :data-type="type"
    :data-url="url"
    :data-meta="node.attrs.meta"
    @click.native="setSelection"
  >
    <div v-if="!(bookmark || embed)" class="hint">
      <Instagram v-if="target === 'instagram'" class="w-4" />

      <Soundcloud v-else-if="target === 'soundcloud'" class="w-4" />

      <span v-else :class="icon" />

      <span class="description" v-text="description" />
    </div>

    <template v-if="bookmark">
      <Bookmark :meta="bookmark" />
    </template>

    <template v-else-if="embed">
      <div class="relative w-full">
        <template v-if="embed.html">
          <div class="absolute inset-0 z-10" />
          <div ref="container" v-html="html" />
        </template>
        <div v-else class="bg-cool-grey flex h-64 w-full items-center justify-center">Unsupported content</div>
      </div>

      <input
        v-model="caption"
        class="caption w-full p-1 text-center"
        placeholder="Type caption for embed (optional)"
        @cut.stop
        @copy.stop
        @paste.stop
      />
    </template>

    <div class="url-input" :class="{ active: selected }">
      <input
        ref="urlInput"
        v-model="input"
        type="text"
        placeholder="Paste link"
        @mousedown.stop
        @click.stop
        @cut.stop
        @copy.stop
        @paste.stop
        @keydown.enter="handleSubmit"
      />
    </div>
  </NodeViewWrapper>
</template>

<style lang="scss" scoped>
.resource {
  @apply flex flex-col items-center justify-center;
  @apply relative rounded-sm p-px;

  &.no-caption {
    .caption {
      @apply hidden;
    }

    &.has-focus {
      .caption {
        @apply block;
      }
    }
  }

  .hint {
    @apply flex cursor-text items-center;
    @apply w-full;

    background-color: #f3f3f3;
    border-radius: 2px;
    padding: 0.625rem;

    .description {
      color: rgb(61 61 61 / 50%);
      font-size: 0.875rem;
      margin-left: 0.625rem;
    }
  }

  .url-input {
    @apply opacity-0 transition-opacity;
    @apply -z-1 absolute top-full;

    background-color: #fff;
    border-radius: 4px;
    box-shadow: 10px 25px 60px 0 rgb(0 0 0 / 30%);
    padding: 0.656rem 0.625rem;
    width: calc(100% - 1.25rem);
    max-width: 30rem;

    &.active {
      @apply z-30 opacity-100;
    }

    input {
      @apply w-full outline-none;

      background-color: #f3f3f3;
      border-radius: 2px;
      border: solid 2px #b2def1;
      padding: 0.375rem;
    }
  }
}
</style>
