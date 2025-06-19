<template>
  <v-container class="mt-10">
    <h2 class="mb-4" data-cy="section-devises-populaires">Devises populaires</h2>
    <v-row v-if="devises && devises.length">
      <v-col
        v-for="devise in devises.slice(0, 5)"
        :key="devise.nom"
        cols="12"
        sm="6"
        md="2"
        data-cy="devise-populaire"
      >
        <v-card class="pa-4 hoverable">
          <v-icon size="32" color="primary">mdi-currency-usd</v-icon>
          <div class="font-weight-bold mt-2">{{ devise.nom }}</div>
          <div>Taux USD: {{ devise.conversion_rates?.USD ?? 'N/A' }}</div>
          <div class="text-caption">Date: {{ devise.date_maj }}</div>
        </v-card>
      </v-col>
    </v-row>
    <div v-else>
      <v-alert type="info">Aucune devise populaire disponible.</v-alert>
    </div>
  </v-container>
</template>

<script setup>
defineProps({
  devises: {
    type: Array,
    required: true
  }
});
</script>