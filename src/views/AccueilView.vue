<template>
  <v-app>
    <HeaderPrincipal />
    <v-main>

      <v-container fluid class="hero-section py-16">
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" class="text-left">
            <h1 class="display-2 font-weight-bold mb-16">
              Suivez, convertissez et comparez les devises en temps réel
            </h1>
            <v-btn color="primary" large class="mt-16" @click="goRegister" data-cy="hero-register-btn">
              Commencer maintenant
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

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

      <v-container class="mt-10">
        <h2 class="mb-16 text-center" data-cy="section-devises" >Devises</h2>
        <v-row class="mb-8" align="center" justify="center">
          <v-col cols="12" md="6">
            <v-card class="pa-6">
              <h3 class="mb-2">Explorez l’univers des devises</h3>
              <div>
                Suivez l’évolution des taux de change en direct et analysez les principales monnaies internationales. Avec WebCur, la gestion et la conversion des devises deviennent intuitives et rapides.
                <br /><br />
                <strong>Analysez les tendances monétaires</strong><br />
                Profitez d’outils clairs pour comparer les devises, anticiper les fluctuations et prendre des décisions éclairées sur vos conversions.
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <div style="height:250px; width:100%;" class="rounded-lg overflow-hidden">
              <v-img
                  src="@/assets/images/Devises_1.png"
                  alt="Devises"
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
                  src="@/assets/images/Devises_2.png"
                  alt="Devises"
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
              <h3 class="mb-2">Votre tableau de bord personnel des devises</h3>
              <div>
                Créez une liste personnalisée de devises favorites et suivez leurs performances. Prenez des décisions éclairées grâce à nos outils intuitifs et à l’historique des données.<br>
                Gérez facilement vos devises préférées, comparez les taux de change en temps réel et accédez à des analyses détaillées pour optimiser vos investissements.<br>
                Profitez d’une expérience sur mesure pour surveiller l’évolution des marchés et rester informé des dernières tendances financières.
              </div>
            </v-card>
          </v-col>
        </v-row>
        <h3 class="mb-4 mt-16">Devises populaires</h3>
        <v-row>
          <v-col
              v-for="devise in devisesPopulaires.slice(0, 5)"
              :key="devise.nom"
              cols="12"
              sm="6"
              md="2"
              data-cy="devise-populaire"
          >
            <v-card class="pa-4 hoverable" @click="goCurrency">
              <v-icon size="32" color="primary">mdi-currency-usd</v-icon>
              <div class="font-weight-bold mt-2">{{ devise.nom }}</div>
              <div>Taux USD: {{ devise.conversion_rates?.USD ?? 'N/A' }}</div>
              <div class="text-caption">Date: {{ devise.date_maj }}</div>
            </v-card>
          </v-col>
        </v-row>
        <v-alert v-if="loadError" type="error" class="my-4">
          {{ loadError }}
        </v-alert>
      </v-container>

      <v-container class="mt-10">
        <h2 class="mb-16 text-center" data-cy="section-actions">Actions</h2>
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
        <h3 class="mb-4 mt-16">Actions populaires</h3>
        <v-row>
          <v-col
              v-for="action in actionsPopulaires.slice(0, 5)"
              :key="action.symbole"
              cols="12"
              sm="6"
              md="2"
              data-cy="action-populaire"
          >
            <v-card class="pa-4 hoverable" @click="goAction">
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

      <v-container class="mt-10 mb-10">
        <h2 class="mb-16 text-center" data-cy="section-entreprises">Entreprises</h2>
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
              data-cy="entreprise-populaire"
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
        <v-alert v-if="loadError" type="error" class="my-4">
          {{ loadError }}
        </v-alert>
      </v-container>
    </v-main>
    <FooterPrincipal />
  </v-app>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import HeaderPrincipal from "../components/HeaderPrincipal.vue";
import FooterPrincipal from "../components/FooterPrincipal.vue";

const store = useStore();
const router = useRouter();
const loadError = ref("");

const devisesPopulaires = computed(() => store.state.devises.listeDevises || []);
const actionsPopulaires = computed(() => store.state.actions.actionsPopulaires || []);
const entreprisesPopulaires = computed(() => store.state.entreprises.entreprisesPopulaires || []);

onMounted(async () => {
  try {
    await store.dispatch("devises/chargerDevisesPopulaires");
    await store.dispatch("actions/chargerActionsPopulaires");
    await store.dispatch("entreprises/chargerEntreprisesPopulaires");
  } catch (e) {
    loadError.value = "Unable to load data. Please try again later.";
  }
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
