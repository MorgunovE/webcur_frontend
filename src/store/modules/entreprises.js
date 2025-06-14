import {
  recupererEntreprisesPopulaires,
  recupererEntreprise,
  recupererHistoriqueEntreprise,
} from "../../api/entreprises";

export default {
  namespaced: true,
  state: {
    entreprisesPopulaires: [],
    entrepriseActive: null,
    historiqueEntreprise: [],
  },
  mutations: {
    setEntreprisesPopulaires(state, entreprises) {
      state.entreprisesPopulaires = entreprises;
    },
    setEntrepriseActive(state, entreprise) {
      state.entrepriseActive = entreprise;
    },
    setHistoriqueEntreprise(state, historique) {
      state.historiqueEntreprise = historique;
    },
  },
  actions: {
    async chargerEntreprisesPopulaires({ commit }) {
      const reponse = await recupererEntreprisesPopulaires();
      commit("setEntreprisesPopulaires", reponse.data);
    },
    async chargerEntreprise({ commit, rootState }, symbole) {
      if (!rootState.auth.token) {
        commit("setEntrepriseActive", null);
        return;
      }
      const reponse = await recupererEntreprise(symbole);
      commit("setEntrepriseActive", reponse.data);
    },
    async chargerHistoriqueEntreprise({ commit, rootState }, { symbole, jours = 30 }) {
      if (!rootState.auth.token) {
        commit("setHistoriqueEntreprise", []);
        return;
      }
      try {
        const res = await recupererHistoriqueEntreprise(symbole, jours);
        commit("setHistoriqueEntreprise", res.data);
      } catch (e) {
        commit("setHistoriqueEntreprise", []);
      }
    },
  },
};
