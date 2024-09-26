<script lang="ts">
import Popup from '../../setting-popup.vue'

export default defineComponent({
  components: { Popup },
  props: {
    name: {
      type: String,
    },
  },
  methods: {
    onclickname(value: string) {
      this.$emit('clicked', value)
    },
  },
})
</script>

<template>
  <!-- 旁邊跑出來的小小popup -->
  <Popup :cover="true" :disabled="false" :lazy="true">
    <template #activator>
      <slot />
    </template>
    <template #default>
      <div class="paper">
        <button
          class="hover:bg-light-pale-grey block w-full bg-white px-4 py-2 text-left text-sm font-light"
          @click="onclickname('rename')"
        >
          Rename
        </button>
        <button
          class="hover:bg-light-pale-grey block w-full bg-white px-4 py-2 text-left text-sm font-light"
          @click="onclickname('duplicate')"
        >
          Duplicate
        </button>
        <button
          class="hover:bg-light-pale-grey block w-full bg-white px-4 py-2 text-left text-sm font-light"
          @click="onclickname('delete')"
        >
          Delete
        </button>
      </div>
    </template>
  </Popup>
</template>

<style lang="scss" scoped>
.paper {
  @apply fixed flex h-full flex-col items-start justify-around bg-white py-1.5;

  width: 8.125rem;
  height: auto;
  border-radius: 2px;
  box-shadow: 5px 10px 30px 0 rgb(0 0 0 / 15%);
}
</style>
