<script lang="ts">
import Vue from 'vue'

import SearchButton from './search-button.vue'

export default Vue.extend({
  name: 'Search',
  components: { SearchButton },
})
</script>

<template>
  <div>
    <SearchButton><slot /></SearchButton>
  </div>
</template>
