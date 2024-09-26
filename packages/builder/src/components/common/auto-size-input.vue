<script lang="ts">
import type { VueConstructor } from 'vue'
import Vue from 'vue'

interface Refs {
  input: HTMLInputElement
}
type withRef = VueConstructor<Vue & { $refs: Refs }>
// The almost pure css auto resize input
export default (Vue as withRef).extend({
  props: {
    type: {
      type: String,
      default: 'input',
    },
    placeholder: {
      type: String,
    },
    value: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
  },
  data: () => ({
    innerValue: ' ',
  }),
  computed: {
    listeners(): Record<string, Function | Function[]> {
      // filter out input listener here, we need to make it align the native v-model behavior
      const { input, ...listeners } = this.$listeners
      return listeners
    },
  },
  watch: {
    value: {
      handler(value: string) {
        if (value === '') {
          // keep a space for correct size
          value = ' '
        }
        this.innerValue = value
      },
      immediate: true,
    },
  },
  methods: {
    focus() {
      this.$refs.input.focus()
    },
    handleInput(event: InputEvent) {
      const $el = event.target as HTMLInputElement
      this.innerValue = $el.value
      this.$emit('input', $el.value)
    },
  },
})
</script>

<template>
  <div class="relative">
    <div class="resizer" :class="[type === 'textarea' && 'textarea-height']">{{ innerValue }}</div>
    <!-- explict use `textarea` and `input` here to let Vue to understand how to compile it -->
    <textarea
      v-if="type === 'textarea'"
      ref="input"
      class="input"
      :placeholder="placeholder"
      :value="value"
      :disabled="disabled"
      @input="handleInput"
      v-on="listeners"
    />
    <input
      v-else
      ref="input"
      class="input"
      :placeholder="placeholder"
      :value="value"
      @input="handleInput"
      v-on="listeners"
    />
  </div>
</template>

<style lang="scss" scoped>
.resizer {
  @apply invisible h-full w-full whitespace-pre-wrap leading-6;
  // ! use `em` here, we need to make it same as current font-size
}

.textarea-height {
  min-height: 1.5em;
}

textarea {
  @apply block h-auto w-full resize-none break-words leading-6;

  transition: opacity 0.2s ease-in;

  &:disabled {
    @apply opacity-15;
  }
}

.input {
  @apply absolute inset-0 h-full w-full resize-none overflow-y-hidden bg-transparent;
  @apply break-words;

  font-weight: inherit;

  &:focus {
    @apply outline-none;
  }

  &::placeholder {
    @apply text-black opacity-40;
  }
}
</style>
