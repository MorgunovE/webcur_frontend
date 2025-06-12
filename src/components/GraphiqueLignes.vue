<template>
  <v-card>
    <v-card-title>{{ titre }}</v-card-title>
    <v-card-text>
      <Line :data="donnees" :options="options" />
    </v-card-text>
  </v-card>
</template>

<script setup>
// Importation des composants nécessaires
import { Line } from 'vue-chartjs';
import { ref, watch, toRefs } from 'vue';

// Props du composant
const props = defineProps({
  titre: { type: String, default: 'Graphique' },
  labels: { type: Array, required: true }, // Labels de l'axe X
  valeurs: { type: Array, required: true }, // Données de l'axe Y
  couleur: { type: String, default: '#1976D2' }
});

// Préparation des données pour Chart.js
const donnees = ref({
  labels: props.labels,
  datasets: [
    {
      label: props.titre,
      data: props.valeurs,
      borderColor: props.couleur,
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      fill: true,
      tension: 0.3
    }
  ]
});

// Options du graphique
const options = ref({
  responsive: true,
  plugins: {
    legend: { display: true },
    title: { display: false }
  },
  scales: {
    x: { title: { display: true, text: 'Date' } },
    y: { title: { display: true, text: 'Valeur' } }
  }
});

// Mettre à jour les données si les props changent
watch(
  () => [props.labels, props.valeurs],
  ([labels, valeurs]) => {
    donnees.value.labels = labels;
    donnees.value.datasets[0].data = valeurs;
  }
);
</script>

<style scoped>
/* Style optionnel pour le composant graphique */
</style>