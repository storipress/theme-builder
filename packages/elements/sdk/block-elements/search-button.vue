<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<template>
  <div>
    <div role="button">
      <slot>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#2c3e50"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M0 0h24v24H0z" stroke="none" />
          <circle cx="10" cy="10" r="7" />
          <path d="m21 21-6-6" />
        </svg>
      </slot>
    </div>
  </div>
</template>
