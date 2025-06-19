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
            <v-btn color="primary" large @click="goRegister" class="mb-16" data-cy="action-hero-register-btn">
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
        <h2 class="mb-16 text-center">Actions</h2>
        <v-row class="mb-8" align="center" justify="center">
          <v-col cols="12" md="6">
            <v-card class="pa-6">
              <h3 class="mb-2">Suivez les leaders du marché boursier</h3>
              <div>
                Analysez les actions les plus populaires et suivez leurs performances en temps réel. WebCur vous offre des outils d'analyse avancés pour anticiper les tendances du marché et optimiser vos investissements. Profitez d'une vue d'ensemble claire, comparez les entreprises et prenez des décisions éclairées pour rester en avance sur le marché.<br><br>
                Accédez à des graphiques interactifs, consultez l'historique des prix et recevez des alertes personnalisées sur les variations importantes. Que vous soyez investisseur débutant ou expérimenté, notre plateforme vous accompagne à chaque étape pour maximiser vos opportunités et minimiser les risques. Découvrez les actualités financières, les analyses d'experts et les classements des meilleures actions du moment.
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <div style="height:250px; width:100%;" class="rounded-lg overflow-hidden">
              <v-img
                  src="@/assets/images/Action_1.png"
                  alt="Action"
                  cover
                  width="100%"
                  height="100%"
                  border-radius="16px"
                  style="object-fit:cover;"
              />
            </div>
          </v-col>
        </v-row>

        <v-row class="mb-8" align="center" justify="center">
          <v-col cols="12" md="6" class="d-flex justify-center">
            <div style="height:250px; width:100%;" class="rounded-lg overflow-hidden">
              <v-img
                  src="@/assets/images/Action_2.png"
                  alt="Action"
                  cover
                  width="100%"
                  height="100%"
                  border-radius="16px"
                  style="object-fit:cover;"
              />
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="pa-6">
              <h3 class="mb-2">Outils avancés d'analyse boursière</h3>
              <div>
                Explorez en profondeur l'historique des actions, comparez les tendances et optimisez votre stratégie d'investissement grâce à nos fonctionnalités d'analyse complètes.
                <br />
                <strong>Analyse approfondie du marché</strong><br />
                Accédez à des graphiques interactifs, comparez les performances en temps réel et utilisez des indicateurs personnalisés pour prendre des décisions éclairées sur vos placements.
              </div>
            </v-card>
          </v-col>
        </v-row>
        <h3 class="mb-4 mt-16" data-cy="section-actions-populaires">Actions populaires</h3>
        <v-row>
          <v-col
            v-for="action in actionsPopulaires.slice(0, 5)"
            :key="action.symbole"
            cols="12"
            sm="6"
            md="2"
          >
            <v-card class="pa-4 hoverable" @click="goRegister" data-cy="action-populaire">
              <v-icon size="32" color="primary">mdi-finance</v-icon>
              <div class="font-weight-bold mt-2">{{ action.symbole }}</div>
              <div>Prix USD: {{ action.close }}</div>
              <div class="text-caption">Date: {{ action.date }}</div>
            </v-card>
          </v-col>
        </v-row>
        <v-alert v-if="loadError" type="error" class="my-4">
          {{ loadError }}
        </v-alert>
      </v-container>

      <!-- AAPL Action Preview with Chart -->
      <v-container class="mt-10" @click="goRegister" data-cy="section-aapl">
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
        <v-alert v-if="loadError" type="error" class="my-4">
          {{ loadError }}
        </v-alert>
      </v-container>
    </v-main>
    <FooterPrincipal />
  </v-app>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import HeaderPrincipal from "../components/HeaderPrincipal.vue";
import FooterPrincipal from "../components/FooterPrincipal.vue";
import GraphiqueLignes from "../components/GraphiqueLignes.vue";

const store = useStore();
const router = useRouter();
const loadError = ref("");

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
  try {
    await store.dispatch("actions/chargerActionsPopulaires");
    await store.dispatch("actions/chargerHistorique", { symbole: "AAPL", jours: 30 });
  } catch (e) {
    loadError.value = "Unable to load data. Please try again later.";
  }
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