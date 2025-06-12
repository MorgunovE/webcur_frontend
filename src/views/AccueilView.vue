<template>
  <v-app>
    <HeaderPrincipal />
    <NavigationPrincipale />
    <v-main>
      <v-container>
        <h2>Bienvenue sur WebCur</h2>
        <p>
          Application WebCur pour explorer les devises, entreprises et actions
          en bourse.<br />
          Découvrez les taux de change, l’historique des entreprises et plus
          encore.
        </p>
        <v-card class="mt-6" outlined>
          <v-card-title>Devises populaires</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="devise in devisesPopulaires"
                :key="devise.nom"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ devise.nom }} — Taux : {{ devise.taux }} ({{
                      devise.date_maj
                    }})
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
    <FooterPrincipal />
  </v-app>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import HeaderPrincipal from "../components/HeaderPrincipal.vue";
import FooterPrincipal from "../components/FooterPrincipal.vue";
import NavigationPrincipale from "../components/NavigationPrincipale.vue";

const store = useStore();
const devisesPopulaires = computed(() => store.state.devises.listeDevises);

onMounted(async () => {
  await store.dispatch("devises/chargerDevisesPopulaires");
});
</script>
