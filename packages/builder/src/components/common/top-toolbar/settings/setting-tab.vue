<script lang="ts">
export default defineComponent({
  props: ['tab'],
  data: () => ({
    currentTab: 'seo',
    btns: [
      { name: 'Basic SEO', id: 'seo' },
      { name: 'Open Graph', id: 'opengraph' },
      { name: 'custom Code', id: 'custom' },
    ],
  }),
  watch: {
    tab() {
      this.activeTab(this.tab)
    },
  },
  methods: {
    onClickTab(value: string) {
      this.$emit('clicked', value)
    },
    activeTab(id: string) {
      this.currentTab = id
    },
  },
})
</script>

<template>
  <div class="btn-container">
    <div class="btn-parent">
      <button
        v-for="(btn, index) in btns"
        :key="index"
        class="btn"
        :class="{ active_btn: currentTab == btn.id }"
        @click="
          onClickTab(btn.id)
          activeTab(btn.id)
        "
      >
        {{ btn.name }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btn-container {
  @apply absolute left-0 right-0 top-5  mx-auto -mb-8 flex w-fit flex-row bg-white p-0;

  z-index: 1;
  border-radius: 2px;

  .btn-parent {
    box-shadow: 0 2px 5px 2px rgba(0, 0, 0, 0.1);
  }

  .btn {
    @apply px-2 py-2 text-sm;

    color: #4c4c4c;
    background: transparent;
    text-transform: uppercase;

    &:nth-child(2) {
      border-left: 1px solid rgba(0, 0, 0, 0.15);
      border-right: 1px solid rgba(0, 0, 0, 0.15);
    }
  }

  .active_btn {
    background: rgba(76, 76, 76, 0.05);
  }
}
</style>
