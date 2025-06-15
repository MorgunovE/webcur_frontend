<template>
  <v-app>
    <HeaderPrincipal />
    <v-main>
      <!-- Hero Section -->
      <v-container fluid class="hero-section py-16">
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" class="text-left">
            <h1 class="display-2 font-weight-bold mb-16">
              Suivez, convertissez et comparez les devises en temps réel
            </h1>
            <v-btn color="primary" large class="mt-16" @click="goRegister">
              Commencer maintenant
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <!-- Features -->
      <v-container class="mt-8">
        <v-row justify="center" align="center">
          <v-col cols="12" md="4">
            <v-card class="pa-6 text-center">
              <v-icon size="48" color="primary">mdi-currency-usd</v-icon>
              <h3 class="mt-3 mb-2">Conversion de devises</h3>
              <div>Convertissez facilement entre plus de 150 devises.</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="pa-6 text-center">
              <v-icon size="48" color="primary">mdi-chart-line</v-icon>
              <h3 class="mt-3 mb-2">Données boursières</h3>
              <div>Suivez les entreprises cotées en bourse en un clin d’œil.</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="pa-6 text-center">
              <v-icon size="48" color="primary">mdi-star-outline</v-icon>
              <h3 class="mt-3 mb-2">Favoris personnalisés</h3>
              <div>Créez un tableau de bord selon vos préférences.</div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Popular Currencies -->
      <v-container class="mt-10">
        <h2 class="mb-4">Devises populaires</h2>
        <v-row>
          <v-col
              v-for="devise in devisesPopulaires.slice(0, 5)"
              :key="devise.nom"
              cols="12"
              sm="6"
              md="2"
          >
            <v-card class="pa-4 hoverable" @click="goCurrency">
              <v-icon size="32" color="primary">mdi-currency-usd</v-icon>
              <div class="font-weight-bold mt-2">{{ devise.nom }}</div>
              <div>Taux USD: {{ devise.conversion_rates?.USD ?? 'N/A' }}</div>
              <div class="text-caption">Date: {{ devise.date_maj }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Popular Actions -->
      <v-container class="mt-10">
        <h2 class="mb-4">Actions populaires</h2>
        <v-row>
          <v-col
              v-for="action in actionsPopulaires.slice(0, 5)"
              :key="action.symbole"
              cols="12"
              sm="6"
              md="2"
          >
            <v-card class="pa-4 hoverable" @click="goAction">
              <v-icon size="32" color="primary">mdi-finance</v-icon>
              <div class="font-weight-bold mt-2">{{ action.symbole }}</div>
              <div>Prix USD: {{ action.close }}</div>
              <div class="text-caption">Date: {{ action.date }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Popular Companies -->
      <v-container class="mt-10 mb-10">
        <h2 class="mb-4">Entreprises populaires</h2>
        <v-row>
          <v-col
              v-for="ent in entreprisesPopulaires.slice(0, 5)"
              :key="ent.symbole"
              cols="12"
              sm="6"
              md="2"
          >
            <v-card class="pa-4 hoverable" @click="goCompany">
              <v-avatar size="32" class="mb-2" v-if="ent.image">
                <img :src="ent.image" alt="Logo" style="width: 100%; height: 100%; object-fit: cover;" />
              </v-avatar>
              <v-icon v-else size="32" color="primary">mdi-domain</v-icon>
              <div class="font-weight-bold mt-2">{{ ent.companyName }}</div>
              <div>Prix USD: {{ ent.price }}</div>
              <div class="text-caption">Date: {{ ent.date_maj }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <FooterPrincipal />
  </v-app>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import HeaderPrincipal from "../components/HeaderPrincipal.vue";
import FooterPrincipal from "../components/FooterPrincipal.vue";

const store = useStore();
const router = useRouter();

const devisesPopulaires = computed(() => store.state.devises.listeDevises || []);
const actionsPopulaires = computed(() => store.state.actions.actionsPopulaires || []);
const entreprisesPopulaires = computed(() => store.state.entreprises.entreprisesPopulaires || []);

onMounted(async () => {
  await store.dispatch("devises/chargerDevisesPopulaires");
  await store.dispatch("actions/chargerActionsPopulaires");
  await store.dispatch("entreprises/chargerEntreprisesPopulaires");
});

function goRegister() {
  router.push("/register");
}
function goCurrency() {
  router.push(`/currencies`);
}
function goAction() {
  router.push(`/stocks`);
}
function goCompany() {
  router.push(`/companies`);
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(
      rgba(25, 25, 50, 0.55),
      rgba(25, 25, 50, 0.55)
  ),
  url('@/assets/images/hero.png') center/cover no-repeat;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  min-height: 600px;
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  color: white;
}
.hoverable {
  transition: box-shadow 0.2s;
  cursor: pointer;
}
.hoverable:hover {
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.15);
}
</style>
