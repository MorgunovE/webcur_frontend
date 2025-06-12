<template>
  <v-app>
    <HeaderPrincipal />
    <NavigationPrincipale />
    <v-main>
      <v-container>
        <h2>Détails de l'entreprise : {{ symbole }}</h2>
        <v-card v-if="entreprise">
          <v-card-title>{{ entreprise.companyName }}</v-card-title>
          <v-card-text>
            Symbole : {{ entreprise.symbole }}<br>
            Prix : {{ entreprise.price }} {{ entreprise.currency }}<br>
            Secteur : {{ entreprise.sector }}<br>
            Description : {{ entreprise.description }}
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
    <FooterPrincipal />
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import HeaderPrincipal from '../components/HeaderPrincipal.vue';
import FooterPrincipal from '../components/FooterPrincipal.vue';
import NavigationPrincipale from '../components/NavigationPrincipale.vue';

const route = useRoute();
const store = useStore();
const symbole = computed(() => route.params.symbol || 'AAPL');
const entreprise = ref(null);

async function chargerEntreprise() {
  await store.dispatch('entreprises/chargerEntreprise', symbole.value);
  entreprise.value = store.state.entreprises.entrepriseActive;
}

onMounted(chargerEntreprise);
</script>