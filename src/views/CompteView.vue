<template>
  <v-app>
    <HeaderPrincipal />
    <v-main>

      <v-container fluid class="hero-section-compte py-16">
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" class="text-left">
            <h1 class="display-2 font-weight-bold mt-16 mb-16" data-cy="compte-hero-title">
              Bienvenue à nouveau, {{ utilisateur?.nom_utilisateur || 'Utilisateur' }} !
            </h1>
            <p class="mb-16">
              Votre parcours financier continue. Suivez vos devises, convertissez facilement et gérez votre portefeuille.
            </p>
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <CompteUserCard />
      </v-container>

      <v-container>
        <v-row class="mt-8">
          <v-col cols="12" md="6">
            <v-card class="pa-6 mb-4" elevation="6">
              <v-card-title>
                <v-icon color="primary" class="mr-2">mdi-currency-usd</v-icon>
                Mes devises favorites
              </v-card-title>
              <v-card-text>
                <div class="mb-2 text-caption">Ajoutez vos devises favorites pour un accès rapide. Vous pouvez choisir dans la liste ou saisir le nom d'une devise.</div>
                <v-row>
                  <v-col
                    v-for="devise in devisesFavoris"
                    :key="devise"
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-card class="pa-3 mb-2 d-flex align-center justify-space-between hoverable">
                      <span class="font-weight-bold">{{ devise }}</span>
                      <div>
                        <v-btn icon color="primary" @click="selectionnerDevise(devise)" class="mr-4">
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn icon color="error" @click="supprimerFavori(devise)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
                <v-autocomplete
                  v-model="nouvelleDeviseFavori"
                  :items="devises"
                  item-title="nom"
                  item-value="nom"
                  label="Ajouter une devise aux favoris"
                  class="mt-2"
                  clearable
                  solo
                />
                <v-btn
                  color="primary"
                  class="mt-2"
                  @click="ajouterFavori"
                  :disabled="!nouvelleDeviseFavori"
                >
                  Ajouter
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="pa-6 mb-4" elevation="6">
              <v-card-title>
                <v-icon color="primary" class="mr-2">mdi-finance</v-icon>
                Mes actions favorites
              </v-card-title>
              <v-card-text>
                <div class="mb-2 text-caption">Ajoutez vos actions favorites pour suivre leur évolution. Sélectionnez dans la liste ou saisissez le symbole.</div>
                <v-row>
                  <v-col
                    v-for="symbole in actionsFavoris"
                    :key="symbole"
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-card class="pa-3 mb-2 d-flex align-center justify-space-between hoverable">
                      <span class="font-weight-bold">{{ symbole }}</span>
                      <div>
                        <v-btn icon color="primary" @click="selectionnerAction(symbole)" class="mr-4">
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn icon color="error" @click="supprimerActionFavori(symbole)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
                <v-autocomplete
                    v-model="nouvelleActionFavori"
                    :items="allActions"
                    item-title="display"
                    item-value="symbole"
                    label="Ajouter une action aux favoris"
                    class="mt-2"
                    clearable
                    solo
                />
                <v-btn
                    color="primary"
                    class="mt-2"
                    @click="searchAndAddAction"
                    :disabled="!nouvelleActionFavori"
                >
                  Ajouter
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-container ref="deviseDetails">
        <DeviseDetailsCard
            :pair="pair"
            :deviseSelectionnee="deviseSelectionnee"
            :devises="devises"
            :deviseActive="deviseActive"
            :labels="labels"
            :valeurs="valeurs"
            :erreur="erreur"
            :loadingHistoriqueDevice="loadingHistoriqueDevice"
            :conversionRates="deviseActive?.conversion_rates"
            @update:deviseSelectionnee="onDeviseSelectionChange"
            @searchDevise="searchDevise"
            @handleDeviseInput="handleDeviseInput"
        />
      </v-container>

      <DevisesPopulaires :devises="devisesPopulaires" />

      <v-container>
        <v-card class="pa-6 mt-8" elevation="6">
          <v-card-title>
            <v-icon color="primary" class="mr-2">mdi-swap-horizontal</v-icon>
            Convertir une devise
          </v-card-title>
          <v-card-text>
            <div class="mb-2 text-caption">Convertissez rapidement un montant d'une devise à une autre. Sélectionnez les devises et saisissez le montant.</div>
            <v-form @submit.prevent="convertir">
              <v-row>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="codeSource"
                    :items="devises"
                    label="Devise source"
                    required
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="codeCible"
                    :items="devises"
                    label="Devise cible"
                    required
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model.number="montant"
                    label="Montant"
                    type="number"
                    required
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn type="submit" color="primary" class="mt-2">Convertir</v-btn>
                </v-col>
              </v-row>
            </v-form>
            <v-alert v-if="resultat" type="success" class="mt-4">
              {{ montant }} {{ codeSource }} = {{ resultat.montant_converti }} {{ codeCible }}
            </v-alert>
            <v-alert v-if="erreur" type="error" class="mt-4">{{ erreur }}</v-alert>
          </v-card-text>
        </v-card>
      </v-container>

      <ActionDetailsCard
          v-model:actionSelectionnee="actionSelectionnee"
          :allActions="allActions"
          :action="action"
          :historiqueAction="historiqueAction"
          :loadingHistoriqueAction="loadingHistoriqueAction"
          ref="actionDetails"
      />

      <ActionsPopulaires :actions="actionsPopulaires" />

      <v-container>
       <v-card class="pa-6 mt-8" elevation="6">
         <v-card-title>
           <v-icon color="primary" class="mr-2">mdi-calculator</v-icon>
           Calculer le coût d'achat d'une action
         </v-card-title>
         <v-card-text>
           <div class="mb-2 text-caption">Calculez le coût total d'achat d'une action à une date donnée et dans la devise de votre choix.</div>
           <v-form @submit.prevent="calculerAchatAction">
             <v-row>
               <v-col cols="12" md="3">
                 <v-select
                   v-model="achatSymbole"
                   :items="allActions"
                   item-title="display"
                   item-value="symbole"
                   label="Symbole"
                   required
                 />
               </v-col>
               <v-col cols="12" md="3">
                 <v-text-field
                   v-model="achatDate"
                   label="Date"
                   type="date"
                   required
                 />
               </v-col>
               <v-col cols="12" md="3">
                 <v-text-field
                   v-model.number="achatQuantite"
                   label="Quantité"
                   type="number"
                   min="1"
                   required
                 />
               </v-col>
               <v-col cols="12" md="3">
                 <v-select
                   v-model="achatDevise"
                   :items="devises"
                   label="Devise"
                   required
                 />
               </v-col>
             </v-row>
             <v-btn type="submit" color="primary" class="mt-2">Calculer</v-btn>
           </v-form>
           <v-alert v-if="achatResultat" type="success" class="mt-4">
             {{ achatResultat.quantite }} {{ achatResultat.symbole }} = {{ achatResultat.cout_total }} {{ achatResultat.devise }} (Taux: {{ achatResultat.taux }})
           </v-alert>
           <v-alert v-if="achatErreur" type="error" class="mt-4">{{ achatErreur }}</v-alert>
         </v-card-text>
       </v-card>
      </v-container>

      <EntrepriseDetailsCard
          v-model:entrepriseSelectionnee="entrepriseSelectionnee"
          :allActions="allActions"
          :labelsEntreprise="labelsEntreprise"
          :valeursEntreprise="valeursEntreprise"
          :loadingHistoriqueEntreprise="loadingHistoriqueEntreprise"
          :entreprise="entreprise"
      />

      <EntreprisesPopulaires :entreprises="entreprisesPopulaires" />

    </v-main>
    <FooterPrincipal />
  </v-app>
</template>

<script setup>
import {ref, computed, onMounted, watch, nextTick} from "vue";
import { useStore } from "vuex";
import HeaderPrincipal from "../components/HeaderPrincipal.vue";
import FooterPrincipal from "../components/FooterPrincipal.vue";
import CompteUserCard from "../components/CompteUserCard.vue";
import EntreprisesPopulaires from "../components/EntreprisesPopulaires.vue";
import ActionsPopulaires from "../components/ActionsPopulaires.vue";
import DevisesPopulaires from "../components/DevisesPopulaires.vue";
import EntrepriseDetailsCard from "../components/EntrepriseDetailsCard.vue";
import ActionDetailsCard from "../components/ActionDetailsCard.vue";
import DeviseDetailsCard from "@/components/DeviseDetailsCard.vue";


const store = useStore();
const deviseActive = computed(() => store.state.devises.deviseActive);
const devisesPopulaires = ref([]);
const deviseSelectionnee = ref("EUR");
const pair = computed(() => deviseSelectionnee.value);
const historique = computed(() => store.state.devises.historiqueDevise);
const labels = computed(() => historique.value.map((e) => e.date_maj));
const valeurs = computed(() =>
    historique.value.map((e) =>
        e.conversion_rates && e.conversion_rates.USD ? e.conversion_rates.USD : null
    )
);
const utilisateur = computed(() => store.state.auth.utilisateur);
const actionSearch = ref("");
const codeSource = ref("USD");
const codeCible = ref("EUR");
const montant = ref(1);
const resultat = ref(null);
const devisesFavoris = computed(() => store.state.devises.devisesFavoris ?? []);
const nouvelleDeviseFavori = ref("");
const actionsFavoris = computed(() => store.state.actions.actionsFavoris);
const actionsPopulaires = computed(() => store.state.actions.actionsPopulaires || []);
const actionSelectionnee = ref("AAPL");
const action = computed(() => store.state.actions.actionActive);
const historiqueAction = computed(() => store.state.actions.historique || []);
const entrepriseSelectionnee = ref("AAPL");
const entreprise = computed(() => store.state.entreprises.entrepriseActive);
const historiqueEntreprise = computed(() => store.state.entreprises.historiqueEntreprise || []);
const loadingHistoriqueEntreprise = ref(false);
const labelsEntreprise = computed(() => historiqueEntreprise.value.map(e => e.date_maj || e.date));
const valeursEntreprise = computed(() => historiqueEntreprise.value.map(e => e.price));
const nouvelleActionFavori = ref(null);
const achatSymbole = ref("");
const achatDate = ref(new Date().toISOString().slice(0, 10));
const achatQuantite = ref(1);
const achatDevise = ref("EUR");
const achatResultat = ref(null);
const achatErreur = ref("");
const deviseDetails = ref(null);
const actionDetails  = ref(null);
const entreprisesPopulaires = computed(() =>
    (store.state.entreprises.entreprisesPopulaires || []).map(e => ({
      ...e,
      display: `${e.symbole} — ${e.companyName}`
    }))
);
const erreur = ref("");
const loadingHistoriqueAction = ref(false);
const loadingHistoriqueDevice = ref(false);

const selectionnerDevise = async (nomDevise) => {
  deviseSelectionnee.value = nomDevise;
  await nextTick();
  const el = deviseDetails.value?.$el || deviseDetails.value;
  el?.scrollIntoView({ behavior: "smooth" });
};

const selectionnerAction = async (nomAction) => {
  actionSelectionnee.value = nomAction;
  entrepriseSelectionnee.value = nomAction;
  await nextTick();
  const el = actionDetails.value?.$el || actionDetails.value;
  el?.scrollIntoView({ behavior: "smooth" });
};

const searchDevise = async (search) => {
  if (search && search.length === 3) {
    try {
      await store.dispatch("devises/chargerDevise", search.toUpperCase());
      erreur.value = "";
    } catch (e) {
      erreur.value = "Devise non trouvée";
    }
  }
};

function getSymbolFromInput(input) {
  if (!input) return "";
  if (typeof input === "string") return input.toUpperCase();
  if (input.symbole) return input.symbole.toUpperCase();
  return "";
}

async function searchAndAddAction() {
  const symbole = getSymbolFromInput(nouvelleActionFavori.value || actionSearch.value);
  if (!symbole) return;
  try {
    await store.dispatch("actions/chargerAction", { symbole, date: getLocalToday() });
    await store.dispatch("actions/chargerHistorique", { symbole, jours: 30 });
    await store.dispatch("actions/ajouterActionFavori", symbole);
    nouvelleActionFavori.value = "";
    actionSearch.value = "";
    await nextTick();
    document.getElementById("action-details")?.scrollIntoView({ behavior: "smooth" });
  } catch (e) {
    erreur.value = "Action non trouvée ou erreur de chargement.";
  }
}

async function handleDeviseInput(event) {
  const value = typeof event === "string" ? event : deviseSelectionnee.value;
  if (value && value.length === 3) {
    const upperValue = value.toUpperCase();
    if (!devises.value.some(d => d.nom === upperValue)) {
      try {
        await store.dispatch("devises/chargerDevise", upperValue);
      } catch (e) {
        erreur.value = "Devise inconnue ou erreur de chargement.";
        return;
      }
    }
    deviseSelectionnee.value = upperValue;
  }
}

async function onDeviseSelectionChange(nom) {
  if (!nom) {
    store.commit("devises/setDeviseActive", null);
    erreur.value = "";
    return;
  }
  try {
    await store.dispatch("devises/chargerDevise", nom);
    erreur.value = "";
  } catch (e) {
    if (e.response && e.response.status === 404) {
      erreur.value = "Devise non trouvée";
    } else if (e.response && e.response.status === 502) {
      erreur.value = "Erreur serveur (502). Veuillez réessayer plus tard.";
    } else {
      erreur.value = "Erreur lors de la récupération de la devise";
    }
    store.commit("devises/setDeviseActive", null);
  }
}

async function chargerEntrepriseEtHistorique(symbole) {
  loadingHistoriqueEntreprise.value = true;
  await store.dispatch("entreprises/chargerEntreprise", symbole);
  await store.dispatch("entreprises/chargerHistoriqueEntreprise", { symbole, jours: 30 });
  loadingHistoriqueEntreprise.value = false;
}

async function calculerAchatAction() {
  achatErreur.value = "";
  achatResultat.value = null;
  try {
    const res = await store.dispatch("actions/calculerAchat", {
      symbole: achatSymbole.value,
      date: achatDate.value,
      quantite: achatQuantite.value,
      code_devise: achatDevise.value,
    });
    achatResultat.value = res;
  } catch (e) {
    achatErreur.value = "Erreur lors du calcul";
  }
}

async function supprimerActionFavori(symbole) {
  await store.dispatch("actions/supprimerActionFavori", symbole);
}

async function chargerDevisesPopulaires() {
  await store.dispatch("devises/chargerDevisesPopulaires");
}

async function chargerDevise() {
  if (!deviseSelectionnee.value) {
    store.commit("devises/setDeviseActive", null);
    return;
  }
  loadingHistoriqueDevice.value = true;
  await store.dispatch("devises/chargerDevise", deviseSelectionnee.value);
  await store.dispatch("devises/chargerHistoriqueDevise", {
    nom: deviseSelectionnee.value,
    jours: 30,
  });
  loadingHistoriqueDevice.value = false;
}

async function chargerActionEtHistorique(symbole) {
  loadingHistoriqueAction.value = true;
  await store.dispatch("actions/chargerAction", { symbole, date: getLocalToday() });
  await store.dispatch("actions/chargerHistorique", { symbole, jours: 30 });
  loadingHistoriqueAction.value = false;
}

function getLocalToday() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

onMounted(async () => {
  await chargerDevisesPopulaires();
  await store.dispatch("devises/chargerDevisesFavoris");
  await store.dispatch("actions/chargerActionsPopulaires");
  if (actionsPopulaires.value.length) {
    actionSelectionnee.value = actionsPopulaires.value[0].symbole;
    await chargerActionEtHistorique(actionSelectionnee.value);
  }
  await store.dispatch("actions/chargerActionsFavoris");
  await store.dispatch("devises/chargerDevisesPopulaires");
  devisesPopulaires.value = store.state.devises.listeDevises;
  await chargerDevise();
  if (actionsPopulaires.value.length) achatSymbole.value = actionsPopulaires.value[0].symbole;
  if (devises.length) achatDevise.value = devises[0];
  await store.dispatch("entreprises/chargerEntreprisesPopulaires");
  if (entreprisesPopulaires.value.length) {
    entrepriseSelectionnee.value = entreprisesPopulaires.value[0].symbole;
    await chargerEntrepriseEtHistorique(entrepriseSelectionnee.value);
  }
});

watch(
    [deviseSelectionnee, actionSelectionnee, entrepriseSelectionnee],
    async ([newDevise, newAction, nouveauSymbole], [oldDevise, oldAction, ancienSymbole]) => {
      if (newDevise !== oldDevise) {
        if (newDevise) {
          await chargerDevise();
        } else {
          store.commit("devises/setDeviseActive", null);
        }
      }
      if (newAction !== oldAction) {
        await chargerActionEtHistorique(newAction);
      }
      if (nouveauSymbole && nouveauSymbole !== ancienSymbole) {
        await chargerEntrepriseEtHistorique(nouveauSymbole);
      }
    }
);

watch(deviseSelectionnee, async (val) => {
  if (!val) {
    store.commit("devises/setDeviseActive", null);
    erreur.value = "";
    return;
  }
  if (val.length >= 3) {
    try {
      await store.dispatch("devises/chargerDevise", val.toUpperCase());
      erreur.value = "";
    } catch (e) {
      store.commit("devises/setDeviseActive", null);
      erreur.value = "Devise non trouvée";
    }
  } else {
    store.commit("devises/setDeviseActive", null);
    erreur.value = "";
  }
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

const devises = [
  "USD", "EUR", "CAD", "GBP", "JPY", "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT",
  "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CDF",
  "CHF", "CLP", "CNY", "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN",
  "ETB", "FJD", "FKP", "FOK", "GEL", "GGP", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD",
  "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "IMP", "INR", "IQD", "IRR", "ISK", "JEP", "JMD",
  "JOD", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR",
  "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK",
  "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP",
  "PKR", "PLN", "PYG", "QAR", "RON", "RUB", "RSD", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP",
  "SLE", "SLL", "SOS", "SRD", "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY",
  "TTD", "TVD", "TWD", "TZS", "UAH", "UGX", "UYU", "UZS", "VES", "VND", "VUV", "WST", "XAF",
  "XCD", "XCG", "XDR", "XOF", "XPF", "YER", "ZAR", "ZMW", "ZWL"
];

const allActions = [
  { symbole: "AAPL", name: "Apple Inc.", display: "AAPL — Apple Inc." },
  { symbole: "MSFT", name: "Microsoft Corporation", display: "MSFT — Microsoft Corporation" },
  { symbole: "GOOGL", name: "Alphabet Inc.", display: "GOOGL — Alphabet Inc." },
  { symbole: "AMZN", name: "Amazon.com Inc.", display: "AMZN — Amazon.com Inc." },
  { symbole: "TSLA", name: "Tesla Inc.", display: "TSLA — Tesla Inc." },
  { symbole: "IBM", name: "International Business Machines Corporation", display: "IBM — International Business Machines Corporation" },
  { symbole: "META", name: "Meta Platforms Inc.", display: "META — Meta Platforms Inc." },
  { symbole: "NVDA", name: "NVIDIA Corporation", display: "NVDA — NVIDIA Corporation" },
  { symbole: "JPM", name: "JPMorgan Chase & Co.", display: "JPM — JPMorgan Chase & Co." },
  { symbole: "V", name: "Visa Inc.", display: "V — Visa Inc." },
  { symbole: "JNJ", name: "Johnson & Johnson", display: "JNJ — Johnson & Johnson" },
  { symbole: "WMT", name: "Walmart Inc.", display: "WMT — Walmart Inc." },
  { symbole: "PG", name: "Procter & Gamble Co.", display: "PG — Procter & Gamble Co." },
  { symbole: "MA", name: "Mastercard Incorporated", display: "MA — Mastercard Incorporated" },
  { symbole: "DIS", name: "The Walt Disney Company", display: "DIS — The Walt Disney Company" },
  { symbole: "HD", name: "The Home Depot, Inc.", display: "HD — The Home Depot, Inc." },
  { symbole: "BAC", name: "Bank of America Corporation", display: "BAC — Bank of America Corporation" },
  { symbole: "XOM", name: "Exxon Mobil Corporation", display: "XOM — Exxon Mobil Corporation" },
  { symbole: "PFE", name: "Pfizer Inc.", display: "PFE — Pfizer Inc." },
  { symbole: "KO", name: "The Coca-Cola Company", display: "KO — The Coca-Cola Company" },
  { symbole: "PEP", name: "PepsiCo, Inc.", display: "PEP — PepsiCo, Inc." },
  { symbole: "CSCO", name: "Cisco Systems, Inc.", display: "CSCO — Cisco Systems, Inc." },
  { symbole: "ORCL", name: "Oracle Corporation", display: "ORCL — Oracle Corporation" },
  { symbole: "INTC", name: "Intel Corporation", display: "INTC — Intel Corporation" },
  { symbole: "CMCSA", name: "Comcast Corporation", display: "CMCSA — Comcast Corporation" },
  { symbole: "ABT", name: "Abbott Laboratories", display: "ABT — Abbott Laboratories" },
  { symbole: "MCD", name: "McDonald's Corporation", display: "MCD — McDonald's Corporation" },
  { symbole: "NKE", name: "NIKE, Inc.", display: "NKE — NIKE, Inc." },
  { symbole: "LLY", name: "Eli Lilly and Company", display: "LLY — Eli Lilly and Company" },
  { symbole: "MRK", name: "Merck & Co., Inc.", display: "MRK — Merck & Co., Inc." },
  { symbole: "UNH", name: "UnitedHealth Group Incorporated", display: "UNH — UnitedHealth Group Incorporated" },
  { symbole: "CVX", name: "Chevron Corporation", display: "CVX — Chevron Corporation" },
  { symbole: "T", name: "AT&T Inc.", display: "T — AT&T Inc." },
  { symbole: "VZ", name: "Verizon Communications Inc.", display: "VZ — Verizon Communications Inc." },
  { symbole: "COST", name: "Costco Wholesale Corporation", display: "COST — Costco Wholesale Corporation" },
  { symbole: "ADBE", name: "Adobe Inc.", display: "ADBE — Adobe Inc." },
  { symbole: "CRM", name: "Salesforce, Inc.", display: "CRM — Salesforce, Inc." },
  { symbole: "PYPL", name: "PayPal Holdings, Inc.", display: "PYPL — PayPal Holdings, Inc." },
  { symbole: "TMO", name: "Thermo Fisher Scientific Inc.", display: "TMO — Thermo Fisher Scientific Inc." },
  { symbole: "DHR", name: "Danaher Corporation", display: "DHR — Danaher Corporation" },
  { symbole: "LIN", name: "Linde plc", display: "LIN — Linde plc" },
  { symbole: "ABBV", name: "AbbVie Inc.", display: "ABBV — AbbVie Inc." },
  { symbole: "AVGO", name: "Broadcom Inc.", display: "AVGO — Broadcom Inc." },
  { symbole: "QCOM", name: "QUALCOMM Incorporated", display: "QCOM — QUALCOMM Incorporated" },
  { symbole: "TXN", name: "Texas Instruments Incorporated", display: "TXN — Texas Instruments Incorporated" },
  { symbole: "SBUX", name: "Starbucks Corporation", display: "SBUX — Starbucks Corporation" },
  { symbole: "UNP", name: "Union Pacific Corporation", display: "UNP — Union Pacific Corporation" },
  { symbole: "MDT", name: "Medtronic plc", display: "MDT — Medtronic plc" },
  { symbole: "BMY", name: "Bristol-Myers Squibb Company", display: "BMY — Bristol-Myers Squibb Company" },
  { symbole: "HON", name: "Honeywell International Inc.", display: "HON — Honeywell International Inc." },
  { symbole: "UPS", name: "United Parcel Service, Inc.", display: "UPS — United Parcel Service, Inc." },
  { symbole: "GS", name: "The Goldman Sachs Group, Inc.", display: "GS — The Goldman Sachs Group, Inc." },
  { symbole: "BA", name: "The Boeing Company", display: "BA — The Boeing Company" },
  { symbole: "C", name: "Citigroup Inc.", display: "C — Citigroup Inc." },
  { symbole: "GE", name: "General Electric Company", display: "GE — General Electric Company" },
  { symbole: "AMGN", name: "Amgen Inc.", display: "AMGN — Amgen Inc." },
  { symbole: "MMM", name: "3M Company", display: "MMM — 3M Company" },
  { symbole: "AXP", name: "American Express Company", display: "AXP — American Express Company" },
  { symbole: "FDX", name: "FedEx Corporation", display: "FDX — FedEx Corporation" },
  { symbole: "GM", name: "General Motors Company", display: "GM — General Motors Company" },
  { symbole: "F", name: "Ford Motor Company", display: "F — Ford Motor Company" }
];

</script>

<style scoped>

.hero-section-compte {
  background: linear-gradient(
      rgba(25, 25, 50, 0.55),
      rgba(25, 25, 50, 0.55)
    ),
    url('@/assets/images/hero-account.png') center/cover no-repeat;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  min-height: 400px;
  color: white;
}

</style>
