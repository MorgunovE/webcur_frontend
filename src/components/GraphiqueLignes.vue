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
import { Line } from "vue-chartjs";
import { ref, watch, toRefs } from "vue";

// Props du composant
const props = defineProps({
  titre: { type: String, default: "Graphique" },
  labels: { type: Array, required: true }, // Labels de l'axe X
  valeurs: { type: Array, required: true }, // Données de l'axe Y
  couleur: { type: String, default: "#1976D2" },
});

// Préparation des données pour Chart.js
const donnees = ref({
  labels: props.labels,
  datasets: [
    {
      label: props.titre,
      data: props.valeurs,
      borderColor: props.couleur,
      backgroundColor: "rgba(25, 118, 210, 0.1)",
      fill: true,
      tension: 0.3,
    },
  ],
});

// Options du graphique
const options = ref({
  responsive: true,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "#222",
        font: {
          family: "SF Pro Display, Segoe UI, Roboto, Arial, sans-serif",
          size: 14,
        },
      },
    },
    title: { display: false },
    tooltip: {
      backgroundColor: "#fff",
      titleColor: "#1976D2",
      bodyColor: "#222",
      borderColor: "#1976D2",
      borderWidth: 1,
      padding: 12,
    },
  },
  elements: {
    line: {
      borderWidth: 3,
      borderColor: "#1976D2",
      backgroundColor: "rgba(25, 118, 210, 0.08)",
      tension: 0.4,
    },
    point: {
      radius: 5,
      backgroundColor: "#fff",
      borderColor: "#1976D2",
      borderWidth: 2,
      hoverRadius: 7,
    },
  },
  scales: {
    x: {
      title: { display: true, text: "Date", color: "#888", font: { size: 13 } },
      grid: { color: "#e0e0e0" },
      ticks: { color: "#222" },
    },
    y: {
      title: {
        display: true,
        text: "Valeur",
        color: "#888",
        font: { size: 13 },
      },
      grid: { color: "#e0e0e0" },
      ticks: { color: "#222" },
    },
  },
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
