<script lang="ts">
import { getProfile } from '../api'
import { authHelpers, SET_TOKEN } from '../store/modules/auth'

export default defineComponent({
  data: () => ({ token: '', status: '' }),
  computed: {
    message() {
      switch (this.status) {
        case 'verifing':
          return 'verifing...'

        case 'invalid':
          return 'invalid!'

        case 'success':
          return 'success!'

        default:
          return ''
      }
    },

    messageColor() {
      switch (this.status) {
        case 'verifing':
          return 'text-yellow-300'

        case 'invalid':
          return 'text-red-400'

        case 'success':
          return 'text-green-300'

        default:
          return 'text-gray-300'
      }
    },
  },
  methods: {
    async handleClick() {
      this.setToken(this.token)
      localStorage.setItem('storipress-token', this.token)
      this.status = 'verifing'
      try {
        const profile = await getProfile()
        this.status = profile ? 'success' : 'invalid'
      } catch (error) {
        console.error(error)
        this.status = 'invalid'
      }
    },
    ...authHelpers.mapMutations({ setToken: SET_TOKEN }),
  },
})
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center">
    <div class="input-wrapper shadow-1 flex w-1/2 overflow-hidden rounded">
      <input v-model="token" class="grow p-2" placeholder="input your token border" />
      <button
        class="bg-clear-blue border-clear-blue grow-0 border px-4 py-2 text-lg leading-6 text-white"
        @click="handleClick"
      >
        set
      </button>
    </div>
    <p class="message bg-almost-black shadow-1 mt-4 w-1/2 rounded p-4 text-left font-medium text-gray-300">
      $ <span class="message" :class="messageColor">{{ message }}</span
      ><span class="message cursor">_</span>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.message {
  font-family: 'Courier New', monospace;
}

.cursor {
  opacity: 1;
  animation: flashing 1s infinite;
}

@keyframes flashing {
  0%,
  49% {
    opacity: 1;
  }

  50%,
  99% {
    opacity: 0;
  }
}
</style>
