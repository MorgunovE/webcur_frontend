import {
  convertirDevise,
  recupererDevise,
  recupererDevisesPopulaires,
  ajouterDeviseFavori,
  supprimerDeviseFavori,
  recupererDevisesFavoris,
  recupererHistoriqueDevise,
} from "../../api/devises";

export default {
  namespaced: true,
  state: {
    listeDevises: [],
    deviseActive: null,
    conversionResultat: null,
    devisesFavoris: [],
    historiqueDevise: [],
  },
  mutations: {
    setListeDevises(state, devises) {
      state.listeDevises = devises;
    },
    setDeviseActive(state, devise) {
      state.deviseActive = devise;
    },
    setConversionResultat(state, resultat) {
      state.conversionResultat = resultat;
    },
    setDevisesFavoris(state, favoris) {
      state.devisesFavoris = favoris;
    },
    setHistoriqueDevise(state, historique) {
      state.historiqueDevise = historique;
    },
  },
  actions: {
    // Récupère les devises populaires depuis l'API
    async chargerDevisesPopulaires({ commit }) {
      try {
        const reponse = await recupererDevisesPopulaires();
        commit("setListeDevises", reponse.data);
      } catch (e) {
        commit("setListeDevises", []);
      }
    },
    // Récupère les informations d'une devise spécifique
    async chargerDevise({ commit }, nom) {
      const reponse = await recupererDevise(nom);
      commit("setDeviseActive", reponse.data);
    },
    async convertirDevise({ commit }, payload) {
      const reponse = await convertirDevise(payload);
      commit("setConversionResultat", reponse.data);
      return reponse.data;
    },
    async chargerDevisesFavoris({ commit, rootState }) {
      if (!rootState.auth.token) {
        commit("setDevisesFavoris", []);
        return;
      }
      try {
        const reponse = await recupererDevisesFavoris();
        commit("setDevisesFavoris", reponse.data.favoris);
      } catch (e) {
        commit("setDevisesFavoris", []);
      }
    },
    async ajouterDeviseFavori({ dispatch }, nom_devise) {
      await ajouterDeviseFavori(nom_devise);
      await dispatch("chargerDevisesFavoris");
    },
    async supprimerDeviseFavori({ dispatch }, nom_devise) {
      await supprimerDeviseFavori(nom_devise);
      await dispatch("chargerDevisesFavoris");
    },
    async chargerHistoriqueDevise({ commit }, { nom, jours = 30 }) {
      const reponse = await recupererHistoriqueDevise(nom, jours);
      commit("setHistoriqueDevise", reponse.data);
    },
  },
};
