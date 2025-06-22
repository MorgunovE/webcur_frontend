<template>
  <v-app>
    <HeaderPrincipal />
    <v-main>

      <v-container fluid class="hero-section py-16">
        <v-row align="center" justify="start">
          <v-col cols="12" md="6" class="text-left">
            <h1 class="display-2 font-weight-bold mb-16 mt-16">
              Suivez et convertissez facilement les devises
            </h1>
            <p class="mb-16">
              WebCur fournit des taux de change en temps réel et des outils pour gérer vos finances dans différentes devises.
            </p>
            <v-btn color="primary" large @click="goRegister" class="mb16" data-cy="devise-hero-register-btn">
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
        <h2 class="mb-16 text-center" data-cy="section-devises">Devises</h2>
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
          >
            <v-card class="pa-4 hoverable" @click="goRegister" data-cy="devise-populaire">
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

      <v-container class="mt-10" @click="goRegister" data-cy="section-cad">
        <h2 class="mb-4">Aperçu du dollar canadien (CAD)</h2>
        <v-row>
          <v-col cols="12" md="6">
            <v-card v-if="cadDevise">
              <v-card-title>{{ cadDevise.nom }}</v-card-title>
              <v-card-text>
                <div class="mb-2">Taux USD: {{ cadDevise.conversion_rates?.USD ?? 'N/A' }}</div>
                <div class="mb-2">Date: {{ cadDevise.date_maj }}</div>
                <div class="mb-4">Base: {{ cadDevise.base_code }}</div>
                <strong>Conversion rates:</strong>
                <div>

                  <v-table density="compact" class="mb-2 styled-table">
                    <thead>
                    <tr>
                      <th>Devise</th>
                      <th>Taux</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="(taux, code) in cadLimitedConversionRates"
                        :key="code"
                    >
                      <td>{{ code }}</td>
                      <td>{{ taux }}</td>
                    </tr>
                    </tbody>
                  </v-table>
                  <div v-if="cadShowAllRates">
                    <v-btn small @click.stop="cadShowAllRates = false" color="primary" variant="text" data-cy="cad-show-less-btn">Show less</v-btn>
                  </div>
                  <div v-else>
                    <v-btn small @click.stop="cadShowAllRates = true" color="primary" variant="text" data-cy="cad-show-all-btn">Show all</v-btn>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <GraphiqueLignes
                v-if="cadLabels.length && cadValeurs.length"
                :labels="cadLabels"
                :valeurs="cadValeurs"
                titre="Historique du CAD contre USD"
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
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import HeaderPrincipal from "../components/HeaderPrincipal.vue";
import FooterPrincipal from "../components/FooterPrincipal.vue";
import GraphiqueLignes from "../components/GraphiqueLignes.vue";

const store = useStore();
const router = useRouter();
const loadError = ref("");

const devisesPopulaires = computed(() => store.state.devises.listeDevises || []);
const cadDevise = computed(() =>
  devisesPopulaires.value.find((d) => d.nom === "CAD")
);

const cadHistorique = computed(() => store.state.devises.historiqueDevise || []);
const cadLabels = computed(() => cadHistorique.value.map((e) => e.date_maj));
const cadValeurs = computed(() =>
  cadHistorique.value.map((e) =>
    e.conversion_rates && e.conversion_rates.USD ? e.conversion_rates.USD : null
  )
);

const cadShowAllRates = ref(false);
const cadLimitedConversionRates = computed(() => {
  if (!cadDevise.value || !cadDevise.value.conversion_rates) return {};
  const entries = Object.entries(cadDevise.value.conversion_rates);
  return cadShowAllRates.value
      ? Object.fromEntries(entries)
      : Object.fromEntries(entries.slice(0, 7));
});

function goRegister() {
  router.push("/register");
}

onMounted(async () => {
  try {
    await store.dispatch("devises/chargerDevisesPopulaires");
    await store.dispatch("devises/chargerHistoriqueDevise", { nom: "CAD", jours: 30 });
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
    url('@/assets/images/hero-currency.png') center/cover no-repeat;
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

.styled-table th, .styled-table td {
  padding: 6px 12px;
  border-bottom: 1px solid #e0e0e0;
}
.styled-table th {
  background: #f5f5f5;
  color: #1976D2;
  font-weight: 600;
}
.styled-table tr:hover td {
  background: #f0f7ff;
}
</style>