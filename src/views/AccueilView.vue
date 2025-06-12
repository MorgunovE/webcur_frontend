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
        <!-- Section des devises populaires -->
        <v-card class="mt-6" outlined>
          <v-card-title>Devises populaires</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                  v-for="devise in devisesPopulaires"
                  :key="devise.nom"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ devise.nom }} — Taux : {{ devise.taux }} ({{ devise.date_maj }})
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
    <FooterPrincipal />
  </v-app>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import HeaderPrincipal from '../components/HeaderPrincipal.vue';
import FooterPrincipal from '../components/FooterPrincipal.vue';
import NavigationPrincipale from '../components/NavigationPrincipale.vue';

// Accès au store Vuex
const store = useStore();

// Computed pour la liste des devises populaires
const devisesPopulaires = computed(() => store.state.devises.listeDevises);

// Charger les devises populaires au montage du composant
onMounted(() => {
  store.dispatch('devises/chargerDevisesPopulaires');
});
</script>