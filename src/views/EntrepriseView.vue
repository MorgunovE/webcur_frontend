<template>
  <v-app>
    <HeaderPrincipal />
    <v-main>
      <!-- Hero Section -->
      <v-container fluid class="hero-section py-16">
        <v-row align="center" justify="start">
          <v-col cols="12" md="6" class="text-left">
            <h1 class="display-2 font-weight-bold mb-16 mt-16">
              Découvrez les leaders du marché et suivez leurs performances en temps réel
            </h1>
            <p class="mb-16">
              WebCur vous permet d’analyser les entreprises cotées, de suivre leurs variations et d’optimiser vos investissements grâce à des outils intuitifs.
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

      <!-- Popular Companies Preview -->
      <v-container class="mt-10">
        <h2 class="mb-16 text-center">Entreprises</h2>
        <v-row class="mb-8" align="center" justify="center">
          <v-col cols="12" md="6">
            <v-card class="pa-6">
              <h3 class="mb-2">Découvrez les entreprises phares</h3>
              <div>
                Obtenez des informations sur les leaders du marché, leur performance boursière et les principaux indicateurs financiers. WebCur vous aide à prendre des décisions d'investissement plus éclairées.<br>
                Comparez les entreprises, suivez leurs évolutions en temps réel et accédez à des analyses détaillées pour optimiser votre portefeuille. Profitez d'une plateforme intuitive pour surveiller vos sociétés favorites et anticiper les tendances du marché.
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <div style="height:250px; width:100%;" class="rounded-lg overflow-hidden">
              <v-img
                  src="@/assets/images/Entreprises_1.png"
                  alt="Entreprises"
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
                  src="@/assets/images/Entreprises_2.png"
                  alt="Entreprises"
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
              <h3 class="mb-2">Analysez la croissance des entreprises</h3>
              <div>
                Visualisez l'évolution de la croissance des entreprises au fil du temps et comparez les leaders du secteur. Notre plateforme vous fournit toutes les données nécessaires pour suivre, évaluer et comprendre le succès des sociétés cotées. Profitez d'outils interactifs pour explorer les tendances, identifier les opportunités et prendre des décisions d'investissement éclairées.<br>
                Accédez à des graphiques dynamiques, des historiques de performances et des analyses détaillées pour chaque entreprise. Suivez les indicateurs clés tels que le chiffre d'affaires, la capitalisation boursière, le volume d'échanges et la rentabilité. Restez informé des dernières actualités et des événements majeurs qui impactent le marché. Grâce à nos outils, développez une vision globale et approfondie pour optimiser vos stratégies d'investissement et anticiper les évolutions du secteur.
              </div>
            </v-card>
          </v-col>
        </v-row>
        <h3 class="mb-4 mt-16">Entreprises populaires</h3>
        <v-row>
          <v-col
            v-for="ent in entreprisesPopulaires.slice(0, 5)"
            :key="ent.symbole"
            cols="12"
            sm="6"
            md="2"
          >
            <v-card class="pa-4 hoverable" @click="goRegister">
              <v-avatar size="32" class="mb-2" v-if="ent.image">
                <img :src="ent.image" alt="Logo" style="width: 100%; height: 100%; object-fit: cover;" />
              </v-avatar>
              <v-icon v-else size="32" color="primary">mdi-domain</v-icon>
              <div class="font-weight-bold mt-2">{{ ent.companyName }}</div>
              <div>Prix USD: {{ ent.price }}</div>
              <div class="text-caption">Date: {{ ent.date_maj }}</div>
              <div class="text-caption">Variation: {{ ent.change }} ({{ ent.changePercentage }})</div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- AAPL Company Preview with Chart -->
      <v-container class="mt-10" @click="goRegister">
        <h2 class="mb-4">Aperçu de l'entreprise Apple (AAPL)</h2>
        <v-row>
          <v-col cols="12" md="6">
            <v-card v-if="aaplCompany">
              <v-card-title>
                <img
                  :src="aaplCompany.image"
                  alt="Logo"
                  height="40"
                  v-if="aaplCompany.image"
                />
                {{ aaplCompany.companyName }} ({{ aaplCompany.symbole }})
              </v-card-title>
              <v-card-text>
                <div><strong>Prix:</strong> {{ aaplCompany.price }} {{ aaplCompany.currency }}</div>
                <div><strong>Variation:</strong> {{ aaplCompany.change }} ({{ aaplCompany.changePercentage }})</div>
                <div><strong>Capitalisation:</strong> {{ aaplCompany.marketCap }}</div>
                <div><strong>Volume:</strong> {{ aaplCompany.volume }}</div>
                <div><strong>Beta:</strong> {{ aaplCompany.beta }}</div>
                <div><strong>Dernier dividende:</strong> {{ aaplCompany.lastDividend }}</div>
                <div><strong>Industrie:</strong> {{ aaplCompany.industry }}</div>
                <div><strong>CEO:</strong> {{ aaplCompany.ceo }}</div>
                <div><strong>Pays:</strong> {{ aaplCompany.country }}</div>
                <div>
                  <strong>Site web:</strong>
                  <a :href="aaplCompany.website" target="_blank">{{ aaplCompany.website }}</a>
                </div>
                <div><strong>Description:</strong> {{ aaplCompany.description }}</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <GraphiqueLignes
              v-if="aaplLabels.length"
              :labels="aaplLabels"
              :valeurs="aaplValeurs"
              titre="Historique du prix"
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

const entreprisesPopulaires = computed(() => store.state.entreprises.entreprisesPopulaires || []);
const aaplCompany = computed(() =>
  entreprisesPopulaires.value.find((e) => e.symbole === "AAPL")
);
const aaplHistorique = computed(() => store.state.entreprises.historiqueEntreprise || []);
const aaplLabels = computed(() => aaplHistorique.value.map((e) => e.date_maj || e.date));
const aaplValeurs = computed(() => aaplHistorique.value.map((e) => e.price));

function goRegister() {
  router.push("/register");
}

onMounted(async () => {
  await store.dispatch("entreprises/chargerEntreprisesPopulaires");
  await store.dispatch("entreprises/chargerHistoriqueEntreprise", { symbole: "AAPL", jours: 30 });
  console.log("AAPL historique:", aaplHistorique.value);
});
</script>

<style scoped>
.hero-section {
  background: linear-gradient(
      rgba(25, 25, 50, 0.55),
      rgba(25, 25, 50, 0.55)
    ),
    url('@/assets/images/hero-company.png') center/cover no-repeat;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  min-height: 600px;
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