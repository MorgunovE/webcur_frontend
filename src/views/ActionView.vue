<template>
  <v-app>
    <HeaderPrincipal />
    <v-main>
      <!-- Hero Section -->
      <v-container fluid class="hero-section py-16">
        <v-row align="center" justify="start">
          <v-col cols="12" md="6" class="text-left">
            <h1 class="display-2 font-weight-bold mt-16 mb-16">
              Analyse des stocks en temps réel
            </h1>
            <p class="mb-16">
              Gardez une longueur d'avance grâce à nos outils et analyses avancés. Faites le suivi de vos investissements et prenez des décisions éclairées.
            </p>
            <v-btn color="primary" large @click="goRegister" class="mb-16">
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

      <!-- Popular Actions Preview -->
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
            <v-card class="pa-4 hoverable" @click="goRegister">
              <v-icon size="32" color="primary">mdi-finance</v-icon>
              <div class="font-weight-bold mt-2">{{ action.symbole }}</div>
              <div>Prix USD: {{ action.close }}</div>
              <div class="text-caption">Date: {{ action.date }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- AAPL Action Preview with Chart -->
      <v-container class="mt-10" @click="goRegister">
        <h2 class="mb-4">Aperçu de l'action Apple (AAPL)</h2>
        <v-row>
          <v-col cols="12" md="6">
            <v-card v-if="aaplAction">
              <v-card-title>{{ aaplAction.symbole }}</v-card-title>
              <v-card-text>
                Date: {{ aaplAction.date }}<br />
                Open: {{ aaplAction.open }}<br />
                Close: {{ aaplAction.close }}<br />
                Volume: {{ aaplAction.volume }}
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <GraphiqueLignes
              v-if="aaplLabels.length && aaplValeurs.length"
              :labels="aaplLabels"
              :valeurs="aaplValeurs"
              titre="Historique de clôture"
              couleur="#1976D2"
            />
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
import GraphiqueLignes from "../components/GraphiqueLignes.vue";

const store = useStore();
const router = useRouter();

const actionsPopulaires = computed(() => store.state.actions.actionsPopulaires || []);
const aaplAction = computed(() =>
  actionsPopulaires.value.find((a) => a.symbole === "AAPL")
);
const aaplHistorique = computed(() => store.state.actions.historique || []);
const aaplLabels = computed(() => aaplHistorique.value.map((e) => e.date));
const aaplValeurs = computed(() => aaplHistorique.value.map((e) => e.close));

function goRegister() {
  router.push("/register");
}

onMounted(async () => {
  await store.dispatch("actions/chargerActionsPopulaires");
  await store.dispatch("actions/chargerHistorique", { symbole: "AAPL", jours: 30 });
});
</script>

<style scoped>
.hero-section {
  background: linear-gradient(
      rgba(25, 25, 50, 0.55),
      rgba(25, 25, 50, 0.55)
    ),
    url('@/assets/images/hero-stocks.png') center/cover no-repeat;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  min-height: 600px;
  color: white;
}
.hero-img {
  width: 100%;
  max-width: 480px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.15);
}
.hoverable {
  transition: box-shadow 0.2s;
  cursor: pointer;
}
.hoverable:hover {
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.15);
}
</style>