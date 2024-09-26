<script lang="ts">
import { mdiAlert } from '@mdi/js'
import Icon from 'shared/components/icon.vue'
import { defineComponent, toRef } from 'vue-demi'

import { UnsavedResponse, useUnsavedStore } from './composables'
import Confirm from './inner-confirm.vue'

const BUTTONS = ['Discard', 'Save'] as const
const responseMapping = {
  Discard: UnsavedResponse.Discard,
  Save: UnsavedResponse.Save,
}

export default defineComponent({
  name: 'UnsavedDialog',
  components: { Confirm, Icon },
  setup() {
    const unsavedStore = useUnsavedStore()
    const show = toRef(unsavedStore, 'show')
    return {
      show,
      mdiAlert,
      buttons: BUTTONS,
      handleResponse(response: 'Discard' | 'Save') {
        unsavedStore.responseDialog(responseMapping[response])
      },
    }
  },
})
</script>

<template>
  <Confirm v-model="show" :buttons="buttons">
    <template #default>
      <div class="px-4 py-4">
        <div class="flex items-start gap-2">
          <div class="rounded-full bg-red-200 p-2">
            <Icon class="h-6 w-6 text-red-600">{{ mdiAlert }}</Icon>
          </div>
          <div class="mt-1">
            <h2 class="mb-2 text-xl font-bold">Warning</h2>
            <div class="text-gray-700">You have unsaved changes.</div>
            <div class="text-gray-700">Do you want to save them?</div>
          </div>
        </div>
      </div>
    </template>
    <template #buttons>
      <div class="divide-warm-grey border-warm-grey flex divide-x border-t">
        <button class="text-brownish-grey block w-full py-3 uppercase" @click="handleResponse('Discard')">
          Discard
        </button>
        <button class="block w-full bg-green-600 py-3 uppercase text-white" @click="handleResponse('Save')">
          Save
        </button>
      </div>
    </template>
  </Confirm>
</template>
