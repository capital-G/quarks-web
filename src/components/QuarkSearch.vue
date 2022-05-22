<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field label="Search" v-model="searchText"></v-text-field>
      </v-col>
    </v-row>

    <v-container fluid>
      <v-row dense>
        <v-col v-for="quark in filteredQuarks" :key="quark.quarkName" :cols="4">
          <v-card class="mx-auto my-12" max-width="374">
            <v-card-title>{{ quark.name }}</v-card-title>

            <v-card-text>
              <v-row align="center" class="mx-0">
                <div class="grey--text ms-4">
                  {{ quark.version }} \\ {{ quark.license }}
                </div>
              </v-row>

              <div class="my-4 text-subtitle-2">{{ quark.author }}</div>
              <div class="my-4 text-subtitle-3">{{ quark.organization }}</div>

              <div>
                {{ quark.summary }}
              </div>
            </v-card-text>

            <v-card-subtitle>Dependencies</v-card-subtitle>

            <v-card-text>
              <v-chip-group
                active-class="deep-purple accent-4 white--text"
                column
              >
                <div
                  v-for="dependency in quark.dependencies"
                  :key="dependency.name"
                >
                  <v-chip>{{ dependency }}</v-chip>
                </div>
              </v-chip-group>
            </v-card-text>

            <v-card-actions>
              <a v-bind:href="quark.url">
                <v-btn color="deep-purple lighten-2" text :disabled="!(url in quark)"> Website </v-btn>
              </a>
              <a v-bind:href="quark.quarkRepo">
                <v-btn color="deep-purple lighten-2" text> Repository </v-btn>
              </a>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import quarksData from "../assets/quarks.json";

export default {
  name: "QuarkSearch",

  data: () => ({
    searchText: "",
    quarks: quarksData,
  }),

  computed: {
    filteredQuarks() {
      if (this.searchText.length === 0) {
        console.log("Search term");
        return quarksData;
      }
      var qs = new Set();
      this.searchText.split(" ").forEach((searchTerm) => {
        ["author", "name", "summary"].forEach((searchField) => {
          quarksData.forEach((quark) => {
            if (searchField in quark) {
              if(typeof quark[searchField] === 'string') {
                if (quark[searchField].toLowerCase().includes(searchTerm.toLowerCase())) {
                  qs.add(quark);
                }
              } else {
                // console.log(`Field ${searchField} on ${quark["name"]} is not a string! ${quark[searchField]}`)
              }
            }
          });
        });
      });
      return qs;
    },
  },
};
</script>
