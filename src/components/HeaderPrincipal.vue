<template>
  <v-app-bar color="primary" dark>
    <v-toolbar-title>WebCur</v-toolbar-title>
    <v-spacer />
    <v-btn to="/" text>Accueil</v-btn>
    <v-btn to="/currencies/USD-EUR" text>Devises</v-btn>
    <v-btn to="/companies/AAPL" text>Entreprises</v-btn>
    <v-btn v-if="!estConnecte" to="/login" text>Connexion</v-btn>
    <v-btn v-if="!estConnecte" to="/register" text>Inscription</v-btn>
    <v-btn v-if="estConnecte" to="/account" text>Mon compte</v-btn>
  </v-app-bar>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const estConnecte = computed(() => !!store.state.auth.token);
</script>
