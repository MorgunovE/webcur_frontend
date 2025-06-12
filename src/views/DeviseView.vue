<template>
  <v-container>
    <h2>Historique de la devise {{ nomDevise }}</h2>
    <GraphiqueLignes
      v-if="labels.length && valeurs.length"
      :titre="'Taux de change ' + nomDevise"
      :labels="labels"
      :valeurs="valeurs"
      couleur="#43A047"
    />
  </v-container>
</template>

<script setup>
// Importation du composant graphique
import GraphiqueLignes from '../components/GraphiqueLignes.vue';
import { ref, onMounted } from 'vue';
import axios from '../api/axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const nomDevise = route.params.pair || 'USD';
const labels = ref([]);
const valeurs = ref([]);

// Charger l'historique de la devise depuis l'API
onMounted(async () => {
  const reponse = await axios.get(`/devises/${nomDevise}/historique?jours=7`);
  labels.value = reponse.data.map(e => e.date_maj);
  valeurs.value = reponse.data.map(e => e.taux);
});
</script>