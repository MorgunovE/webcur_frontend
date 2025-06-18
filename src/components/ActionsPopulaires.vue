<template>
  <v-container class="mt-10">
    <h2 class="mb-4">Actions populaires</h2>
    <v-row>
      <v-col
        v-for="action in actions.slice(0, 5)"
        :key="action.symbole"
        cols="12"
        sm="6"
        md="2"
      >
        <v-card class="pa-4 hoverable">
          <v-icon size="32" color="primary">mdi-finance</v-icon>
          <div class="font-weight-bold mt-2">{{ action.symbole }}</div>
          <div>Prix USD: {{ action.close }}</div>
          <div class="text-caption">Date: {{ action.date }}</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
defineProps({
  actions: {
    type: Array,
    required: true
  }
});
</script>