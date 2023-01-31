<template>
  <v-app>
    <v-main>
      <QuarkSearch />
      <v-footer padless color="grey">
        <v-col class="text-center" cols="6">
          <strong><a href="https://github.com/capital-G/quarks-web/">github.com/capital-G/quarks-web/</a></strong>
        </v-col>
        <v-col class="text-center" cols="6">
          <strong><a href="https://github.com/supercollider-quarks/quarks">github.com/supercollider-quarks/quarks</a></strong>
        </v-col>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>
import QuarkSearch from "./components/QuarkSearch.vue";

export default {
  name: "App",

  components: {
    QuarkSearch,
  },

  data: () => ({
    //
  }),
};
</script>
