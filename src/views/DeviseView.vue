<template>
  <v-app>
    <HeaderPrincipal />
    <NavigationPrincipale />
    <v-main>
      <v-container>
        <h2>Informations sur la devise : {{ pair }}</h2>
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="deviseSelectionnee"
              :items="devisesPopulaires"
              label="Sélectionner une devise"
              @change="chargerDevise"
            />
            <v-card v-if="deviseActive">
              <v-card-title>{{ deviseActive.nom }}</v-card-title>
              <v-card-text>
                <div>Taux : {{ deviseActive.taux }}</div>
                <div>Date : {{ deviseActive.date_maj }}</div>
                <div>Base : {{ deviseActive.base_code }}</div>
                <div>
                  <strong>Conversion rates:</strong>
                  <v-simple-table dense>
                    <thead>
                      <tr>
                        <th>Devise</th>
                        <th>Taux</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(taux, code) in limitedConversionRates"
                        :key="code"
                      >
                        <td>{{ code }}</td>
                        <td>{{ taux }}</td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                  <div v-if="showAllRates">
                    <v-btn small @click="showAllRates = false">Show less</v-btn>
                  </div>
                  <div v-else>
                    <v-btn small @click="showAllRates = true">Show all</v-btn>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <GraphiqueLignes
              v-if="labels.length"
              :labels="labels"
              :valeurs="valeurs"
              titre="Historique contre USD"
              couleur="#1976D2"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <FooterPrincipal />
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import HeaderPrincipal from "../components/HeaderPrincipal.vue";
import FooterPrincipal from "../components/FooterPrincipal.vue";
import NavigationPrincipale from "../components/NavigationPrincipale.vue";
import GraphiqueLignes from "../components/GraphiqueLignes.vue";

const store = useStore();
const route = useRoute();
const pair = computed(() => route.params.pair || "USD-EUR");
const devisesPopulaires = ref([]);
const deviseSelectionnee = ref(route.params.paire || "USD-EUR");
const deviseActive = computed(() => store.state.devises.deviseActive);
const historique = computed(() => store.state.devises.historiqueDevise);
const showAllRates = ref(false);

const labels = computed(() => historique.value.map((e) => e.date_maj));
const valeurs = computed(() => historique.value.map((e) => e.taux));

const limitedConversionRates = computed(() => {
  if (!deviseActive.value || !deviseActive.value.conversion_rates) return {};
  return Object.fromEntries(
      Object.entries(deviseActive.value.conversion_rates).slice(0, 10)
  );
});

async function chargerDevises() {
  await store.dispatch("devises/chargerDevisesPopulaires");
  devisesPopulaires.value = store.state.devises.listeDevises.map((d) => d.nom);
}

async function chargerDevise() {
  await store.dispatch("devises/chargerDevise", deviseSelectionnee.value);
  deviseActive.value = store.state.devises.deviseActive;
  await store.dispatch("devises/chargerHistoriqueDevise", {
    nom: deviseSelectionnee.value,
    jours: 30,
  });
  historique.value = store.state.devises.historiqueDevise;
}

onMounted(async () => {
  await store.dispatch("devises/chargerDevisesPopulaires");
  await store.dispatch("devises/chargerDevise", deviseSelectionnee.value);
  await store.dispatch("devises/chargerHistoriqueDevise", {
    nom: deviseSelectionnee.value,
    jours: 30,
  });
});

watch(
    () => deviseSelectionnee.value,
    async (nouvelleDevise) => {
      await store.dispatch("devises/chargerDevise", nouvelleDevise);
      await store.dispatch("devises/chargerHistoriqueDevise", {
        nom: nouvelleDevise,
        jours: 30,
      });
    }
);
</script>
