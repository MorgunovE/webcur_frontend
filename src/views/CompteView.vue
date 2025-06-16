<template>
  <v-app>
    <HeaderPrincipal />
    <v-main>

      <v-container fluid class="hero-section-compte py-16">
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" class="text-left">
            <h1 class="display-2 font-weight-bold mt-16 mb-16">
              Bienvenue à nouveau, {{ utilisateur?.nom_utilisateur || 'Utilisateur' }} !
            </h1>
            <p class="mb-16">
              Votre parcours financier continue. Suivez vos devises, convertissez facilement et gérez votre portefeuille.
            </p>
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="pa-6 mb-4" elevation="8">
              <v-card-title>
                <h2 class="mb-4">Mon compte</h2>
                <v-avatar size="40" class="mr-3">
                  <v-icon color="primary">mdi-account-circle</v-icon>
                </v-avatar>
                {{ utilisateur?.nom_utilisateur || 'Utilisateur' }}
              </v-card-title>
              <v-card-text>
                <div>Email : {{ utilisateur?.email }}</div>
                <v-btn color="error" class="mt-4" @click="seDeconnecter">Se déconnecter</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="pa-6 mb-4" elevation="8">
              <v-card-title>Modifier le profil</v-card-title>
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
          </v-col>
        </v-row>
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
                      <v-btn icon color="error" @click="supprimerFavori(devise)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-card>
                  </v-col>
                </v-row>
                <v-autocomplete
                  v-model="nouvelleDeviseFavori"
                  :items="devises"
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
                      <v-btn icon color="error" @click="supprimerActionFavori(symbole)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-card>
                  </v-col>
                </v-row>
                <v-autocomplete
                  v-model="nouvelleActionFavori"
                  :items="actionsPopulaires"
                  item-title="symbole"
                  item-value="symbole"
                  label="Ajouter une action aux favoris"
                  class="mt-2"
                  clearable
                  solo
                />
                <v-btn
                  color="primary"
                  class="mt-2"
                  @click="ajouterActionFavori"
                  :disabled="!nouvelleActionFavori"
                >
                  Ajouter
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <v-card class="pa-6 mt-8" elevation="6">
          <v-card-title>
            <v-icon color="primary" class="mr-2">mdi-currency-usd</v-icon>
            Informations sur la devise : {{ pair }}
            <v-btn icon v-if="deviseActive" @click="generatePdf('deviseCard')">
              <v-icon>mdi-file-pdf-box</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text v-show="deviseActive">
            <div ref="deviseCard">
              <div class="mb-2 text-caption">Recherchez une devise par nom ou sélectionnez-en une pour afficher ses informations et son historique.</div>
              <v-row>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="deviseSelectionnee"
                    :items="devisesPopulaires"
                    item-title="nom"
                    item-value="nom"
                    label="Sélectionner ou rechercher une devise"
                    clearable
                    solo
                  />
                  <v-card v-if="deviseActive">
                    <v-card-title>{{ deviseActive.nom }}</v-card-title>
                    <v-card-text>
                      <div>Taux : {{ deviseActive.taux }}</div>
                      <div>Date : {{ deviseActive.date_maj }}</div>
                      <div>Base : {{ deviseActive.base_code }}</div>
                      <div>
                        <strong>Conversion rates:</strong>
                        <v-simple-table dense>
                          <thead>
                          <tr>
                            <th>Devise</th>
                            <th>Taux</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr
                              v-for="(taux, code) in limitedConversionRates"
                              :key="code"
                          >
                            <td>{{ code }}</td>
                            <td>{{ taux }}</td>
                          </tr>
                          </tbody>
                        </v-simple-table>
                        <div v-if="showAllRates">
                          <v-btn small @click="showAllRates = false">Show less</v-btn>
                        </div>
                        <div v-else>
                          <v-btn small @click="showAllRates = true">Show all</v-btn>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6">
                  <GraphiqueLignes
                      v-if="!loadingHistoriqueDevice && labels.length && valeurs.length"
                      :labels="labels"
                      :valeurs="valeurs"
                      :titre="`Historique de ${pair} contre USD`"
                      couleur="#1976D2"
                  />
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-container>

      <v-container class="mt-10">
        <h2 class="mb-4">Devises populaires</h2>
        <v-row>
          <v-col
            v-for="devise in devisesPopulaires.slice(0, 5)"
            :key="devise.nom"
            cols="12"
            sm="6"
            md="2"
          >
            <v-card class="pa-4 hoverable">
              <v-icon size="32" color="primary">mdi-currency-usd</v-icon>
              <div class="font-weight-bold mt-2">{{ devise.nom }}</div>
              <div>Taux USD: {{ devise.conversion_rates?.USD ?? 'N/A' }}</div>
              <div class="text-caption">Date: {{ devise.date_maj }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

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

      <v-container>
        <v-card class="pa-6 mt-8" elevation="6">
          <v-card-title>
            <v-icon color="primary" class="mr-2">mdi-finance</v-icon>
            Informations sur l'action : {{ actionSelectionnee }}
          </v-card-title>
          <v-card-text>
            <div class="mb-2 text-caption">Recherchez une action par symbole ou sélectionnez-en une pour afficher ses informations et son historique.</div>
            <v-autocomplete
              v-model="actionSelectionnee"
              :items="actionsPopulaires"
              item-title="symbole"
              item-value="symbole"
              label="Sélectionner ou rechercher une action"
              clearable
              solo
            />
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
                v-if="!loadingHistoriqueAction && historiqueAction.length"
                :labels="historiqueAction.map(e => e.date)"
                :valeurs="historiqueAction.map(e => e.close)"
                titre="Historique de clôture"
                couleur="#1976D2"
            />
          </v-card-text>
        </v-card>
      </v-container>

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
            <v-card class="pa-4 hoverable">
              <v-icon size="32" color="primary">mdi-finance</v-icon>
              <div class="font-weight-bold mt-2">{{ action.symbole }}</div>
              <div>Prix USD: {{ action.close }}</div>
              <div class="text-caption">Date: {{ action.date }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

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
                   :items="actionsPopulaires"
                   item-title="symbole"
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

      <v-container>
        <v-card class="pa-6 mt-8" elevation="6">
          <v-card-title>
            <v-icon color="primary" class="mr-2">mdi-domain</v-icon>
            Informations sur l'entreprise : {{ entrepriseSelectionnee }}
          </v-card-title>
          <v-card-text>
            <div class="mb-2 text-caption">Recherchez une entreprise par nom ou sélectionnez-en une pour afficher ses informations et son historique.</div>
            <v-autocomplete
              v-model="entrepriseSelectionnee"
              :items="entreprisesPopulaires"
              item-title="companyName"
              item-value="symbole"
              label="Sélectionner ou rechercher une entreprise"
              clearable
              solo
            />
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
                <div><strong>Prix:</strong> {{ entreprise.price }} {{ entreprise.currency }}</div>
                <div><strong>Variation:</strong> {{ entreprise.change }} ({{ entreprise.changePercentage }})</div>
                <div><strong>Capitalisation:</strong> {{ entreprise.marketCap }}</div>
                <div><strong>Volume:</strong> {{ entreprise.volume }}</div>
                <div><strong>Beta:</strong> {{ entreprise.beta }}</div>
                <div><strong>Dernier dividende:</strong> {{ entreprise.lastDividend }}</div>
                <div><strong>Industrie:</strong> {{ entreprise.industry }}</div>
                <div><strong>CEO:</strong> {{ entreprise.ceo }}</div>
                <div><strong>Pays:</strong> {{ entreprise.country }}</div>
                <div>
                  <strong>Site web:</strong>
                  <a :href="entreprise.website" target="_blank">{{ entreprise.website }}</a>
                </div>
                <div><strong>Description:</strong> {{ entreprise.description }}</div>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
        <GraphiqueLignes
            v-if="!loadingHistoriqueEntreprise && labelsEntreprise.length"
            :labels="labelsEntreprise"
            :valeurs="valeursEntreprise"
            titre="Historique du prix"
            couleur="#1976D2"
        />
      </v-container>

      <v-container class="mt-10">
        <h2 class="mb-4">Entreprises populaires</h2>
        <v-row>
          <v-col
            v-for="ent in entreprisesPopulaires.slice(0, 5)"
            :key="ent.symbole"
            cols="12"
            sm="6"
            md="2"
          >
            <v-card class="pa-4 hoverable">
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

    </v-main>
    <FooterPrincipal />
  </v-app>
</template>

<script setup>
import {ref, computed, onMounted, watch, nextTick} from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import HeaderPrincipal from "../components/HeaderPrincipal.vue";
import FooterPrincipal from "../components/FooterPrincipal.vue";
import GraphiqueLignes from "../components/GraphiqueLignes.vue";

const store = useStore();
const deviseActive = computed(() => store.state.devises.deviseActive);
const devisesPopulaires = computed(() => store.state.devises.listeDevises || []);
const deviseSelectionnee = ref("EUR");
const pair = computed(() => deviseSelectionnee.value);
const historique = computed(() => store.state.devises.historiqueDevise);
const showAllRates = ref(false);
const labels = computed(() => historique.value.map((e) => e.date_maj));
const valeurs = computed(() =>
    historique.value.map((e) =>
        e.conversion_rates && e.conversion_rates.USD ? e.conversion_rates.USD : null
    )
);

const limitedConversionRates = computed(() => {
  if (!deviseActive.value || !deviseActive.value.conversion_rates) return {};
  const entries = Object.entries(deviseActive.value.conversion_rates);
  return showAllRates.value
      ? Object.fromEntries(entries)
      : Object.fromEntries(entries.slice(0, 10));
});

const router = useRouter();
const utilisateur = computed(() => store.state.auth.utilisateur);
const nouveauNom = ref(
  utilisateur.value ? utilisateur.value.nom_utilisateur : ""
);

const devises = computed(() =>
    (store.state.devises.listeDevises || []).map((d) => d.nom)
);

const codeSource = ref("USD");
const codeCible = ref("EUR");
const montant = ref(1);
const resultat = ref(null);
const erreur = ref("");
const devisesFavoris = computed(() => store.state.devises.devisesFavoris);
const nouvelleDeviseFavori = ref("");

const actionsFavoris = computed(() => store.state.actions.actionsFavoris);
const actionsPopulaires = computed(() => store.state.actions.actionsPopulaires || []);
const actionSelectionnee = ref("AAPL");
const action = computed(() => store.state.actions.actionActive);
const historiqueAction = computed(() => store.state.actions.historique || []);

const entreprisesPopulaires = computed(() => store.state.entreprises.entreprisesPopulaires || []);
const entrepriseSelectionnee = ref("AAPL");
const entreprise = computed(() => store.state.entreprises.entrepriseActive);
const historiqueEntreprise = computed(() => store.state.entreprises.historiqueEntreprise || []);
const loadingHistoriqueEntreprise = ref(false);

const labelsEntreprise = computed(() => historiqueEntreprise.value.map(e => e.date_maj || e.date));
const valeursEntreprise = computed(() => historiqueEntreprise.value.map(e => e.price));

const nouvelleActionFavori = ref("");

const achatSymbole = ref("");
const achatDate = ref(new Date().toISOString().slice(0, 10));
const achatQuantite = ref(1);
const achatDevise = ref("EUR");
const achatResultat = ref(null);
const achatErreur = ref("");

const deviseCard = ref(null);

async function generatePdf(refName) {
  await nextTick();
  const el = refName === 'deviseCard' ? deviseCard.value : null;
  if (!el) return;
  const originalBg = el.style.backgroundColor;
  const whiteBg = "#fff";
  el.style.backgroundColor = whiteBg;

  el.querySelectorAll("*").forEach(child => {
    child.style.backgroundColor = whiteBg;
  });

  html2canvas(el, { backgroundColor: whiteBg, useCORS: true }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
    pdf.save("devise.pdf");

    el.style.backgroundColor = originalBg;
    el.querySelectorAll("*").forEach(child => {
      child.style.backgroundColor = "";
    });
  });
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
    const response = await store.dispatch("utilisateur/mettreAJourUtilisateur", {
      id: utilisateur.value.id,
      donnees: { nom_utilisateur: nouveauNom },
    });
    const updatedUser = {
      ...utilisateur.value,
      nom_utilisateur: nouveauNom,
    };
    store.commit("auth/setUtilisateur", updatedUser);
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
}

async function chargerDevise() {
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
  devisesPopulaires.value = store.state.devises.listeDevises.map((d) => d.nom);
  await chargerDevise();
  if (actionsPopulaires.value.length) achatSymbole.value = actionsPopulaires.value[0].symbole;
  if (devises.value.length) achatDevise.value = devises.value[0];
  await store.dispatch("entreprises/chargerEntreprisesPopulaires");
  if (entreprisesPopulaires.value.length) {
    entrepriseSelectionnee.value = entreprisesPopulaires.value[0].symbole;
    await chargerEntrepriseEtHistorique(entrepriseSelectionnee.value);
  }
});

const loadingHistoriqueAction = ref(false);
const loadingHistoriqueDevice = ref(false);


watch(
    [deviseSelectionnee, actionSelectionnee, entrepriseSelectionnee],
    async ([newDevise, newAction, nouveauSymbole], [oldDevise, oldAction, ancienSymbole]) => {
      if (newDevise !== oldDevise) {
        await chargerDevise();
      }
      if (newAction !== oldAction) {
        await chargerActionEtHistorique(newAction);
      }
      if (nouveauSymbole && nouveauSymbole !== ancienSymbole) {
        await chargerEntrepriseEtHistorique(nouveauSymbole);
      }
    }
);

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
