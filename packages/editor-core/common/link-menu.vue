<script lang="ts">
import copy from 'copy-to-clipboard'
import { computed, defineComponent, onMounted, ref } from 'vue-demi'

export default defineComponent({
  setup(_, { emit }) {
    const inputElement = ref<HTMLInputElement>()
    const input = ref('')
    const formattedLink = computed(() => {
      const value = input.value
      if (!value) {
        return ''
      }

      if (!value.startsWith('http')) {
        return `https://${value}`
      }

      return value
    })

    onMounted(() => {
      inputElement.value!.focus()
    })

    return {
      inputElement,
      input,
      formattedLink,
      handleComplete() {
        emit('input', formattedLink.value)
      },
      copyURL() {
        copy(formattedLink.value)
      },
    }
  },
})
</script>

<template>
  <div class="link-dialog">
    <input
      ref="inputElement"
      v-model="input"
      :placeholder="`${input ? 'Edit' : 'Paste'} link`"
      type="url"
      @keydown.enter.prevent="handleComplete"
    />

    <template v-if="input">
      <div class="link-to-text">Link to</div>

      <a class="link-action" :href="formattedLink" target="_blank" rel="noopener nofollow noreferrer">
        <span class="icon-web" />

        <span>{{ formattedLink }}</span>
      </a>

      <hr />

      <div class="link-action" role="button" @click="copyURL">
        <span class="icon-copy" />

        <span>Copy Link</span>
      </div>

      <div class="link-action" role="button" @click="$emit('input', '')">
        <span class="icon-delete" />

        <span>Remove Link</span>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.link-dialog {
  @apply fixed z-10;

  background-color: #fff;
  border-radius: 2px;
  box-shadow: 3px 6px 30px 2px rgba(0, 0, 0, 0.15);
  width: 20rem;
  padding: 0.6rem;

  input {
    align-items: center;
    background-color: #f0f0f0;
    border-style: solid;
    border-width: 2px;
    border-color: #b2def1;
    border-radius: 4px;
    height: 2.25rem;
    width: 100%;
    padding-left: 0.5rem;

    &:focus {
      outline: none;
    }
  }

  hr {
    margin: 0.3rem -0.6rem;
  }

  .link-to-text {
    color: rgba(61, 61, 61, 0.4);
    font-size: 0.625rem;
    font-weight: 700;
    line-height: 0.625rem;
    margin-top: 0.6rem;
    margin-bottom: 0.2rem;
    margin-left: 0.4rem;
    padding-top: 0.4rem;
    text-transform: uppercase;
  }

  .link-action {
    @apply flex items-center;
    @apply cursor-pointer no-underline;

    margin: 0 -0.6rem;
    padding: 0.5rem 2rem 0.5rem 1rem;
    transition: background-color 50ms ease;

    &:hover {
      background-color: #f0f0f0;
    }

    span {
      color: #4c4c4c;
      font-size: 0.9rem;
      font-weight: 300;
      line-height: 100%;
      margin-left: 0.75rem;
    }
  }
}
</style>
