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
      </v-container>
    </v-main>
    <FooterPrincipal />
  </v-app>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import HeaderPrincipal from '../components/HeaderPrincipal.vue';
import FooterPrincipal from '../components/FooterPrincipal.vue';
import NavigationPrincipale from '../components/NavigationPrincipale.vue';

const store = useStore();
const router = useRouter();
const utilisateur = computed(() => store.state.auth.utilisateur);

async function seDeconnecter() {
  await store.dispatch('auth/deconnexion');
  router.push('/');
}
</script>