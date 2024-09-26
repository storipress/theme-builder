<script lang="ts">
import type { Photo, UnsplashClient } from 'shared/clients/unsplash'
import type { PropType } from 'vue-demi'
import type { DialogInfo } from '../modules'
import { debounce } from 'lodash'
import { CircularProgress } from 'shared/components/circular-progress'
import { Dialog } from 'shared/components/dialog'
import { defineComponent, ref, watch } from 'vue-demi'

import Intersect from 'vue-intersect'
import { useRemoteDialogProvider } from '../modules'
import Unsplash from './unsplash-full.svg'

interface UnsplashPhoto {
  src: string
  alt: string
  title: string
}

type UnsplashDialogInfo = DialogInfo<'unsplash', true, UnsplashPhoto>

export default defineComponent({
  components: { Dialog, Unsplash, Intersect, CircularProgress },

  props: {
    client: {
      type: Object as PropType<UnsplashClient>,
      required: true,
    },
  },

  setup(props) {
    const { param: open, reply, close } = useRemoteDialogProvider<UnsplashDialogInfo>('unsplash')
    const { listPhotos, searchPhotos, downloadPhoto } = props.client
    const grid = ref<HTMLElement>()
    const photos = ref([] as Photo[])
    const search = ref('')
    let loading = true
    let loaded = 0
    let page = 1

    function reset() {
      loaded = 0
      page = 1
    }

    function fetchPage(page: number): Promise<Photo[]> {
      return search.value ? searchPhotos(search.value, page) : listPhotos(page)
    }

    watch(open, async (open) => {
      if (open) {
        reset()

        loading = true

        photos.value = await listPhotos(page)

        loading = false
      }
    })

    return {
      grid,
      open,
      photos,
      search,
      close,
      searchPhotos: debounce(async () => {
        reset()

        loading = true

        photos.value = await searchPhotos(search.value)
      }, 150),

      async submit(photo: Photo) {
        await downloadPhoto(photo.id)
        /* eslint-disable no-secrets/no-secrets */
        reply({
          src: photo.urls.regular,
          alt: photo.description,
          title: `<p>Photo by <a href="${photo.user.links.html}?utm_source=storipress&utm_medium=referral&utm_campaign=api-credit">${photo.user.name}</a> / <a href="https://unsplash.com/?utm_source=storipress&utm_medium=referral&utm_campaign=api-credit">Unsplash</a></p>`,
        })
        /* eslint-enable no-secrets/no-secrets */
      },
      countLoad() {
        loaded += 1

        if (loaded === photos.value.length) {
          loading = false
        }
      },
      async loadMore() {
        if (loading) {
          return
        }

        page += 1

        const newPhotos = await fetchPage(page)

        photos.value = [...photos.value, ...newPhotos]
      },
    }
  },
})
</script>

<template>
  <Dialog v-if="open" @click="close">
    <div class="picker">
      <div class="picker__header">
        <Unsplash class="unsplash" />

        <label class="picker__search">
          <input v-model="search" placeholder="Search for an image..." @input="searchPhotos" />
        </label>
      </div>

      <div
        ref="grid"
        v-masonry
        item-selector=".picker__photo"
        transition-duration="0"
        gutter="8"
        class="picker__photos"
      >
        <figure v-for="photo in photos" :key="photo.id" v-masonry-tile class="picker__photo" @click="submit(photo)">
          <img class="w-full" :src="photo.urls.small" :alt="photo.description" @load="countLoad" />
          <figcaption class="picker__action">
            <span class="mr-1 overflow-hidden rounded-full">
              <img :src="photo.user.profile_image.small" :alt="photo.user.name" />
            </span>
            <span class="grow text-white">{{ photo.user.name }}</span>
          </figcaption>
        </figure>
      </div>

      <Intersect @enter="loadMore">
        <div class="flex w-full justify-center">
          <CircularProgress indeterminate />
        </div>
      </Intersect>
    </div>
  </Dialog>
</template>

<style lang="scss" scoped>
.picker {
  @apply overflow-y-auto bg-white;

  border-radius: 2px;
  box-shadow: 5px 10px 30px 0 rgba(0, 0, 0, 0.15);
  max-height: 30rem;
  height: auto;
  padding: 0.6rem;
  width: 33rem;

  &__header {
    @apply sticky z-10 flex items-center bg-white;

    top: -0.6rem;
    margin: -0.6rem -0.6rem 0.3rem -0.6rem;
    padding: 0.7rem;

    .unsplash {
      height: 1.4375rem;
      margin-left: 0.7rem;
      margin-right: 0.7rem;
    }

    .picker__search {
      @apply grow;

      background-color: #f0f0f0;
      border: 2px solid #b2def1;
      border-radius: 4px;
      margin-left: 0.6rem;
      padding-left: 0.5rem;

      input {
        @apply bg-transparent outline-none;

        height: 2.25rem;
      }
    }
  }

  &__photos {
    @apply w-full overflow-x-hidden;

    // @todo only Firefox supports masonry currently
    //display: grid;
    //gap: 0.5rem;
    //grid-template-rows: masonry;
    //grid-template-columns: repeat(3, 1fr);
  }

  &__photo {
    @apply h-min;

    margin-bottom: 0.5rem;
    width: calc((100% - 1rem) / 3);

    &:hover {
      cursor: pointer;
      opacity: 0.5;

      .picker__action {
        @apply visible;
      }
    }

    img {
      border-radius: 5px;
    }
  }

  &__action {
    @apply invisible absolute bottom-0 flex w-full items-center bg-black bg-opacity-50 p-2;
  }
}
</style>
