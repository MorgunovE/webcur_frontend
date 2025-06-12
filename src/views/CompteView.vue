<template>
  <v-app>
    <HeaderPrincipal />
    <NavigationPrincipale />
    <v-main>
      <v-container>
        <h2>Mon compte</h2>
        <v-card v-if="utilisateur">
          <v-card-title>{{ utilisateur.nom_utilisateur }}</v-card-title>
          <v-card-text>
            Email : {{ utilisateur.email }}
          </v-card-text>
          <v-btn color="error" @click="seDeconnecter">Se déconnecter</v-btn>
        </v-card>
        <v-alert v-else type="info">Veuillez vous connecter pour accéder à votre compte.</v-alert>
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
import { useRouter } from 'vue-router';
import HeaderPrincipal from '../components/HeaderPrincipal.vue';
import FooterPrincipal from '../components/FooterPrincipal.vue';
import NavigationPrincipale from '../components/NavigationPrincipale.vue';

const store = useStore();
const router = useRouter();
const utilisateur = computed(() => store.state.auth.utilisateur);


// Computed pour la liste des devises populaires
const devisesPopulaires = computed(() => store.state.devises.listeDevises);

// Charger les devises populaires au montage du composant
onMounted(() => {
  store.dispatch('devises/chargerDevisesPopulaires');
});

async function seDeconnecter() {
  await store.dispatch('auth/deconnexion');
  router.push('/');
}
</script>