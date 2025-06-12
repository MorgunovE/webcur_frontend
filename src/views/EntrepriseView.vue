<template>
  <v-app>
    <HeaderPrincipal />
    <NavigationPrincipale />
    <v-main>
      <v-container>
        <h2>Informations sur l'entreprise : {{ symbole }}</h2>
        <v-row>
          <v-col cols="12" md="6">
            <v-card v-if="entreprise">
              <v-card-title>
                <img
                  :src="entreprise.image"
                  alt="Logo"
                  height="40"
                  v-if="entreprise.image"
                />
                {{ entreprise.companyName }} ({{ entreprise.symbole }})
              </v-card-title>
              <v-card-text>
                <div>
                  <strong>Prix:</strong> {{ entreprise.price }}
                  {{ entreprise.currency }}
                </div>
                <div>
                  <strong>Variation:</strong> {{ entreprise.change }} ({{
                    entreprise.changePercentage
                  }})
                </div>
                <div>
                  <strong>Capitalisation:</strong> {{ entreprise.marketCap }}
                </div>
                <div><strong>Volume:</strong> {{ entreprise.volume }}</div>
                <div><strong>Beta:</strong> {{ entreprise.beta }}</div>
                <div>
                  <strong>Dernier dividende:</strong>
                  {{ entreprise.lastDividend }}
                </div>
                <div><strong>Industrie:</strong> {{ entreprise.industry }}</div>
                <div><strong>CEO:</strong> {{ entreprise.ceo }}</div>
                <div><strong>Pays:</strong> {{ entreprise.country }}</div>
                <div>
                  <strong>Site web:</strong>
                  <a :href="entreprise.website" target="_blank">{{
                    entreprise.website
                  }}</a>
                </div>
                <div>
                  <strong>Description:</strong> {{ entreprise.description }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <GraphiqueLignes
              v-if="labels.length"
              :labels="labels"
              :valeurs="valeurs"
              titre="Historique du prix"
              couleur="#1976D2"
            />
          </v-col>
        </v-row>
        <h3 class="mt-8">Entreprises populaires</h3>
        <v-row>
          <v-col
            v-for="pop in entreprisesPopulaires"
            :key="pop.symbole"
            cols="12"
            md="4"
          >
            <v-card>
              <v-card-title>
                <img :src="pop.image" alt="Logo" height="30" v-if="pop.image" />
                {{ pop.companyName }} ({{ pop.symbole }})
              </v-card-title>
              <v-card-text>
                Prix: {{ pop.price }} {{ pop.currency }}<br />
                Variation: {{ pop.change }} ({{ pop.changePercentage }})
              </v-card-text>
              <v-card-actions>
                <v-btn :to="`/companies/${pop.symbole}`" color="primary" text
                  >Voir</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <FooterPrincipal />
  </v-app>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import HeaderPrincipal from "../components/HeaderPrincipal.vue";
import FooterPrincipal from "../components/FooterPrincipal.vue";
import NavigationPrincipale from "../components/NavigationPrincipale.vue";
import GraphiqueLignes from "../components/GraphiqueLignes.vue";

const route = useRoute();
const store = useStore();
const symbole = computed(() => route.params.symbole || "AAPL");

const entreprise = computed(() => store.state.entreprises.entrepriseActive);
const entreprisesPopulaires = computed(
  () => store.state.entreprises.entreprisesPopulaires
);
const historique = computed(() => store.state.entreprises.historiqueEntreprise);

const labels = computed(() => historique.value.map((e) => e.date_maj));
const valeurs = computed(() => historique.value.map((e) => e.price));

async function chargerDonnees() {
  await store.dispatch("entreprises/chargerEntreprise", symbole.value);
  await store.dispatch("entreprises/chargerHistoriqueEntreprise", {
    symbole: symbole.value,
    jours: 30,
  });
  await store.dispatch("entreprises/chargerEntreprisesPopulaires");
}

onMounted(chargerDonnees);
watch(() => symbole.value, chargerDonnees);
</script>
