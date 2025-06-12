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
                Taux : {{ deviseActive.taux }}<br>
                Date : {{ deviseActive.date_maj }}
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <GraphiqueLignes
              v-if="historique.length"
              :labels="labels"
              :valeurs="valeurs"
              titre="Historique du taux"
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
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import HeaderPrincipal from '../components/HeaderPrincipal.vue';
import FooterPrincipal from '../components/FooterPrincipal.vue';
import NavigationPrincipale from '../components/NavigationPrincipale.vue';
import GraphiqueLignes from '../components/GraphiqueLignes.vue';

const route = useRoute();
const store = useStore();
const pair = computed(() => route.params.pair || 'USD-EUR');
const devisesPopulaires = ref([]);
const deviseSelectionnee = ref('USD');
const deviseActive = ref(null);
const historique = ref([]);

const labels = computed(() => historique.value.map(e => e.date_maj));
const valeurs = computed(() => historique.value.map(e => e.taux));

async function chargerDevises() {
  await store.dispatch('devises/chargerDevisesPopulaires');
  devisesPopulaires.value = store.state.devises.listeDevises.map(d => d.nom);
}

async function chargerDevise() {
  await store.dispatch('devises/chargerDevise', deviseSelectionnee.value);
  deviseActive.value = store.state.devises.deviseActive;
  // Charger l'historique (exemple d'appel direct, à adapter selon l'API)
  const reponse = await fetch(`http://localhost:5000/devises/${deviseSelectionnee.value}/historique?jours=7`);
  historique.value = await reponse.json();
}

onMounted(async () => {
  await chargerDevises();
  deviseSelectionnee.value = pair.value.split('-')[0];
  await chargerDevise();
});
</script>