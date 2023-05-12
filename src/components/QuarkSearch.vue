<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="logoImageUrl"
          class="my-3"
          contain
          height="200"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field label="Search" v-model="searchText"></v-text-field>
      </v-col>
    </v-row>

    <v-container fluid class="d-flex align-content-start flex-wrap">
      <v-row wrap>
        <v-col
        v-for="quark in filteredQuarks"
        :key="quark.quarkName"
        md="6"
        lg="4"
        >
          <v-card class="mx-auto my-8" max-width="370" min-width="370">
            <v-card-title>{{ quark.name || quark.quarkName }}</v-card-title>
            
            <v-card-text>
              <v-row align="center" class="mx-0 mb-2">
                <div class="grey--text ms-4">
                  Version: {{ quark.version || "?" }}<br/>
                  Last update: {{ moment(new Date(quark.lastGitCommitDate * 1000)).fromNow() }}
                </div>
              </v-row>

              <div class="my-4 text-subtitle-2">{{ quark.author || quark.copyright }}
                
                <p v-if="quark.organization" class="font-italic"> @ {{ quark.organization }} </p>
              </div>

              <!-- </div>
              <div class="my-4 text-subtitle-3"></div> -->

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
              <a v-if="quark.url" :href="quark.url">
                <v-btn color="deep-purple lighten-2" text> Website </v-btn>
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
import moment from 'moment';

export default {
  name: "QuarkSearch",

  created: function () {
    this.moment = moment;
    this.logoImageUrl = new URL(`/logo.svg`, import.meta.url).href
  },

  data: () => ({
    searchText: "",
    quarks: quarksData,
  }),

  computed: {
    filteredQuarks() {
      if (this.searchText.length === 0) {
        // console.log(quarksData);
        return quarksData.sort((a, b) => b.lastGitCommitDate - a.lastGitCommitDate);
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
