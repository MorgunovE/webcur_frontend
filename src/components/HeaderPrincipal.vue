<template>
  <v-app-bar app color="primary" dark elevation="2">
    <v-toolbar-title class="header-title d-flex align-center">
      <img :src="require('@/assets/images/logo.svg')" alt="WebCur" class="logo" />
      <span class="ml-4">WebCur</span>
    </v-toolbar-title>
    <v-spacer />
    <template v-if="!isMobile">
      <v-btn to="/" text>Accueil</v-btn>
      <v-btn to="/currencies" text>Devises</v-btn>
      <v-btn to="/stocks" text>Actions</v-btn>
      <v-btn to="/companies" text>Entreprises</v-btn>
      <v-btn v-if="!estConnecte" to="/login" text>Connexion</v-btn>
      <v-btn v-if="!estConnecte" to="/register" text>Inscription</v-btn>
      <v-btn v-if="estConnecte" to="/account" text>Mon compte</v-btn>
    </template>
    <template v-else>
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-app-bar-nav-icon v-bind="props" />
        </template>
        <v-list>
          <v-list-item to="/" title="Accueil" />
          <v-list-item to="/currencies" title="Devises" />
          <v-list-item to="/stocks" title="Actions" />
          <v-list-item to="/companies" title="Entreprises" />
          <v-list-item v-if="!estConnecte" to="/login" title="Connexion" />
          <v-list-item v-if="!estConnecte" to="/register" title="Inscription" />
          <v-list-item v-if="estConnecte" to="/account" title="Mon compte" />
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useDisplay } from "vuetify";

const store = useStore();
const estConnecte = computed(() => !!store.state.auth.token);
const { smAndDown } = useDisplay();
const isMobile = computed(() => smAndDown.value);
</script>

<style scoped>
.header-title {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 2.2rem;
}
.logo {
  height: 32px;
  vertical-align: middle;
}
.v-toolbar-title__placeholder {
  display: flex;
  align-items: center;
}
@media (max-width: 600px) {
  .header-title {
    font-size: 1.6rem;
  }
  .logo {
    height: 28px;
    width: 28px;
  }
  .v-app-bar {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
}
</style>