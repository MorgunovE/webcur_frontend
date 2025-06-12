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
        <!-- Currency selection and info -->
        <v-row>
          <v-col cols="12" md="6">
            <v-select
                v-model="deviseSelectionnee"
                :items="devisesPopulaires"
                label="Select a currency"
            />
            <v-btn color="primary" @click="chargerDevise(deviseSelectionnee)">
              Load Currency Info
            </v-btn>
            <v-card v-if="deviseActive" class="mt-4">
              <v-card-title>{{ deviseActive.nom }}</v-card-title>
              <v-card-text>
                Rate: {{ deviseActive.taux }}<br>
                Date: {{ deviseActive.date_maj }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
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
import {onMounted, computed, ref} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import HeaderPrincipal from '../components/HeaderPrincipal.vue';
import FooterPrincipal from '../components/FooterPrincipal.vue';
import NavigationPrincipale from '../components/NavigationPrincipale.vue';

const store = useStore();
const deviseActive = ref(null);
const devisesPopulaires = ref([]);
const deviseSelectionnee = ref('USD');
const router = useRouter();
const utilisateur = computed(() => store.state.auth.utilisateur);



// Charger les devises populaires au montage du composant
async function chargerDevisesPopulaires() {
  await store.dispatch('devises/chargerDevisesPopulaires');
  devisesPopulaires.value = store.state.devises.listeDevises.map(d => d.nom);
}

async function chargerDevise(nom) {
  await store.dispatch('devises/chargerDevise', nom);
  deviseActive.value = store.state.devises.deviseActive;
}

onMounted(chargerDevisesPopulaires);

async function seDeconnecter() {
  await store.dispatch('auth/deconnexion');
  router.push('/');
}
</script>