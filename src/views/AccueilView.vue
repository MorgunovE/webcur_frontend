<template>
  <v-app>
    <HeaderPrincipal />
    <NavigationPrincipale />
    <v-main>
      <v-container>
        <h1>Bienvenue sur WebCur</h1>
        <p>
          Application éducative pour explorer les devises, entreprises et actions en bourse.<br>
          Utilisez la navigation pour accéder aux fonctionnalités principales.
        </p>
      </v-container>
    </v-main>
    <FooterPrincipal />
  </v-app>
</template>

<script setup>
import HeaderPrincipal from '../components/HeaderPrincipal.vue';
import FooterPrincipal from '../components/FooterPrincipal.vue';
import NavigationPrincipale from '../components/NavigationPrincipale.vue';
</script>