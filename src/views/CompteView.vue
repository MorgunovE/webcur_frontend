<template>
  <v-app>
    <HeaderPrincipal />
    <NavigationPrincipale />
    <v-main>
      <v-container>
        <h2>Mon compte</h2>
        <v-card v-if="utilisateur">
          <v-card-title>{{ utilisateur.nom_utilisateur }}</v-card-title>
          <v-card-text>Email : {{ utilisateur.email }}</v-card-text>
          <v-btn color="error" @click="seDeconnecter">Se déconnecter</v-btn>
        </v-card>
        <v-card v-if="utilisateur">
          <v-card-title>{{ utilisateur.nom_utilisateur }}</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="nouveauNom"
              label="Nouveau nom d'utilisateur"
            />
            <v-btn color="primary" @click="mettreAJourUtilisateur(nouveauNom)">
              Mettre à jour
            </v-btn>
            <v-divider class="my-4"></v-divider>
            <v-btn color="error" @click="supprimerMonCompte">
              Supprimer mon compte
            </v-btn>
          </v-card-text>
        </v-card>
        <v-alert v-else type="info">
          Veuillez vous connecter pour accéder à votre compte.
        </v-alert>
        <v-container>
          <h2>Mes devises favorites</h2>
          <v-list>
            <v-list-item v-for="devise in devisesFavoris" :key="devise">
              <v-list-item-title>{{ devise }}</v-list-item-title>
              <v-btn icon color="error" @click="supprimerFavori(devise)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
          <v-select
            v-model="nouvelleDeviseFavori"
            :items="devises"
            label="Ajouter une devise aux favoris"
            class="mt-2"
          />
          <v-btn
            color="primary"
            @click="ajouterFavori"
            :disabled="!nouvelleDeviseFavori"
          >
            Ajouter
          </v-btn>
        </v-container>
        <v-container>
          <h2>Mes actions favorites</h2>
          <v-list>
            <v-list-item v-for="symbole in actionsFavoris" :key="symbole">
              <v-list-item-title>{{ symbole }}</v-list-item-title>
              <v-btn icon color="error" @click="supprimerActionFavori(symbole)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
          <v-select
            v-model="nouvelleActionFavori"
            :items="actionsPopulaires"
            label="Ajouter une action aux favoris"
            class="mt-2"
          />
          <v-btn
            color="primary"
            @click="ajouterActionFavori"
            :disabled="!nouvelleActionFavori"
          >
            Ajouter
          </v-btn>
        </v-container>
        <!-- Currency selection and info -->
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="deviseSelectionnee"
              :items="devisesPopulaires"
              label="Select a currency"
            />
            <v-btn color="primary" @click="chargerDevise(deviseSelectionnee)">
              Load Currency Info
            </v-btn>
            <v-card v-if="deviseActive" class="mt-4">
              <v-card-title>{{ deviseActive.nom }}</v-card-title>
              <v-card-text>
                Rate: {{ deviseActive.taux }}<br />
                Date: {{ deviseActive.date_maj }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <!-- Section des devises populaires -->
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
      <v-container>
        <h2>Convert Currency</h2>
        <v-form @submit.prevent="convertir">
          <v-row>
            <v-col cols="12" md="3">
              <v-select
                v-model="codeSource"
                :items="devises"
                label="Source currency"
                required
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="codeCible"
                :items="devises"
                label="Target currency"
                required
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model.number="montant"
                label="Amount"
                type="number"
                required
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-btn type="submit" color="primary">Convert</v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-alert v-if="resultat" type="success" class="mt-4">
          {{ montant }} {{ codeSource }} = {{ resultat.montant_converti }}
          {{ codeCible }}
        </v-alert>
        <v-alert v-if="erreur" type="error" class="mt-4">{{ erreur }}</v-alert>
      </v-container>
      <v-container>
        <h3>Actions populaires</h3>
        <v-list>
          <v-list-item v-for="action in actionsPopulaires" :key="action">
            <v-list-item-title>{{ action }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <h3>Entreprises populaires</h3>
        <v-list>
          <v-list-item v-for="ent in entreprisesPopulaires" :key="ent.symbole">
            <v-list-item-title>
              {{ ent.companyName }} ({{ ent.symbole }})</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-container>
    </v-main>
    <FooterPrincipal />
  </v-app>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import HeaderPrincipal from "../components/HeaderPrincipal.vue";
import FooterPrincipal from "../components/FooterPrincipal.vue";
import NavigationPrincipale from "../components/NavigationPrincipale.vue";

const store = useStore();
const deviseActive = ref(null);
const devisesPopulaires = computed(() => store.state.devises.listeDevises);
const deviseSelectionnee = ref("USD");
const router = useRouter();
const utilisateur = computed(() => store.state.auth.utilisateur);
const nouveauNom = ref(
  utilisateur.value ? utilisateur.value.nom_utilisateur : ""
);

const devises = computed(() =>
  store.state.devises.listeDevises.map((d) => d.nom)
);
const codeSource = ref("USD");
const codeCible = ref("EUR");
const montant = ref(1);
const resultat = ref(null);
const erreur = ref("");
const devisesFavoris = computed(() => store.state.devises.devisesFavoris);
const nouvelleDeviseFavori = ref("");

const actionsFavoris = computed(() => store.state.actions.actionsFavoris);
const actionsPopulaires = computed(() => store.state.actions.actionsPopulaires);
const entreprisesPopulaires = computed(
  () => store.state.entreprises.entreprisesPopulaires
);

const nouvelleActionFavori = ref("");

async function ajouterActionFavori() {
  if (nouvelleActionFavori.value) {
    await store.dispatch(
      "actions/ajouterActionFavori",
      nouvelleActionFavori.value
    );
    nouvelleActionFavori.value = "";
  }
}
async function supprimerActionFavori(symbole) {
  await store.dispatch("actions/supprimerActionFavori", symbole);
}

async function mettreAJourUtilisateur(nouveauNom) {
  if (utilisateur.value) {
    await store.dispatch("utilisateur/mettreAJourUtilisateur", {
      id: utilisateur.value.id,
      donnees: { nom_utilisateur: nouveauNom },
    });
  }
}

async function supprimerMonCompte() {
  if (utilisateur.value) {
    await store.dispatch(
      "utilisateur/supprimerUtilisateur",
      utilisateur.value.id
    );
    await seDeconnecter();
  }
}

// Charger les devises populaires au montage du composant
async function chargerDevisesPopulaires() {
  await store.dispatch("devises/chargerDevisesPopulaires");
  devisesPopulaires.value = store.state.devises.listeDevises.map((d) => d.nom);
}

async function chargerDevise(nom) {
  await store.dispatch("devises/chargerDevise", nom);
  deviseActive.value = store.state.devises.deviseActive;
}

onMounted(async () => {
  await chargerDevisesPopulaires();
  await store.dispatch("devises/chargerDevisesFavoris");
  await store.dispatch("actions/chargerActionsPopulaires");
  await store.dispatch("actions/chargerActionsFavoris");
  await store.dispatch("devises/chargerDevisesPopulaires");
  await store.dispatch("entreprises/chargerEntreprisesPopulaires");
});

async function ajouterFavori() {
  if (nouvelleDeviseFavori.value) {
    await store.dispatch(
      "devises/ajouterDeviseFavori",
      nouvelleDeviseFavori.value
    );
    nouvelleDeviseFavori.value = "";
  }
}

async function supprimerFavori(nom) {
  await store.dispatch("devises/supprimerDeviseFavori", nom);
}

async function seDeconnecter() {
  await store.dispatch("auth/deconnexion");
  await router.push("/");
}

async function convertir() {
  erreur.value = "";
  resultat.value = null;
  try {
    const res = await store.dispatch("devises/convertirDevise", {
      code_source: codeSource.value,
      code_cible: codeCible.value,
      montant: montant.value,
    });
    resultat.value = res;
  } catch (e) {
    erreur.value = "Conversion failed";
  }
}
</script>
