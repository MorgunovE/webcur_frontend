<template>
  <v-navigation-drawer app>
    <v-list>
      <v-list-item to="/" title="Accueil" />
      <v-list-item to="/currencies/USD-EUR" title="Devises" />
      <v-list-item to="/stocks/AAPL" title="Actions" />
      <v-list-item to="/companies/AAPL" title="Entreprises" />
      <v-list-item v-if="!estConnecte" to="/login" title="Connexion" />
      <v-list-item v-if="!estConnecte" to="/register" title="Inscription" />
      <v-list-item v-if="estConnecte" to="/account" title="Mon compte" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const estConnecte = computed(() => !!store.state.auth.token);
</script>