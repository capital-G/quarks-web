<template>
  <v-app>
    <v-main>
      <QuarkSearch/>
    </v-main>
  </v-app>
</template>

<script>
import QuarkSearch from './components/QuarkSearch.vue'

export default {
  name: 'App',

  components: {
    QuarkSearch,
  },

  data: () => ({
    //
  }),
}
</script>
