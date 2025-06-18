<template>
  <v-container class="mt-10">
    <h2 class="mb-4">Entreprises populaires</h2>
    <v-row>
      <v-col
        v-for="ent in entreprises.slice(0, 5)"
        :key="ent.symbole"
        cols="12"
        sm="6"
        md="2"
      >
        <v-card class="pa-4 hoverable">
          <v-avatar size="32" class="mb-2" v-if="ent.image">
            <img :src="ent.image" alt="Logo" style="width: 100%; height: 100%; object-fit: cover;" />
          </v-avatar>
          <v-icon v-else size="32" color="primary">mdi-domain</v-icon>
          <div class="font-weight-bold mt-2">{{ ent.companyName }}</div>
          <div>Prix USD: {{ ent.price }}</div>
          <div class="text-caption">Date: {{ ent.date_maj }}</div>
          <div class="text-caption">Variation: {{ ent.change }} ({{ ent.changePercentage }})</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
defineProps({
  entreprises: {
    type: Array,
    required: true
  }
});
</script>