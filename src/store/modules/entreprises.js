import axios from '../../api/axios';

export default {
  namespaced: true,
  state: {
    entreprisesPopulaires: [],
    entrepriseActive: null
  },
  mutations: {
    setEntreprisesPopulaires(state, entreprises) {
      state.entreprisesPopulaires = entreprises;
    },
    setEntrepriseActive(state, entreprise) {
      state.entrepriseActive = entreprise;
    }
  },
  actions: {
    // Charge les entreprises populaires
    async chargerEntreprisesPopulaires({ commit }) {
      const reponse = await axios.get('/societes/populaires');
      commit('setEntreprisesPopulaires', reponse.data);
    },
    // Charge les détails d'une entreprise
    async chargerEntreprise({ commit }, symbole) {
      const reponse = await axios.get(`/societes/${symbole}`);
      commit('setEntrepriseActive', reponse.data);
    }
  }
};