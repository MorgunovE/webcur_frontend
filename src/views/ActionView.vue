<template>
  <v-app>
    <HeaderPrincipal />
    <NavigationPrincipale />
    <v-main>
      <v-container>
        <h2>Action : {{ symbole }}</h2>
        <v-card v-if="action">
          <v-card-title>{{ action.symbole }}</v-card-title>
          <v-card-text>
            Date: {{ action.date }}<br />
            Open: {{ action.open }}<br />
            Close: {{ action.close }}<br />
            Volume: {{ action.volume }}
          </v-card-text>
        </v-card>
        <GraphiqueLignes
          v-if="historique.length"
          :labels="historique.map((e) => e.date)"
          :valeurs="historique.map((e) => e.close)"
          titre="Historique de clôture"
          couleur="#1976D2"
        />
      </v-container>
    </v-main>
    <FooterPrincipal />
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import HeaderPrincipal from "../components/HeaderPrincipal.vue";
import FooterPrincipal from "../components/FooterPrincipal.vue";
import NavigationPrincipale from "../components/NavigationPrincipale.vue";
import GraphiqueLignes from "../components/GraphiqueLignes.vue";

const route = useRoute();
const store = useStore();
const symbole = route.params.symbole || "AAPL";
const action = ref(null);
const historique = ref([]);

function getLocalToday() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
const today = getLocalToday();

onMounted(async () => {
  await store.dispatch("actions/chargerAction", { symbole, date: today });
  action.value = store.state.actions.actionActive;
  await store.dispatch("actions/chargerHistorique", { symbole, jours: 30 });
  historique.value = store.state.actions.historique;
});
</script>
