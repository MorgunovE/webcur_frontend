import axios from '../../api/axios';

export default {
  namespaced: true,
  state: {
    listeDevises: [],
    deviseActive: null
  },
  mutations: {
    setListeDevises(state, devises) {
      state.listeDevises = devises;
    },
    setDeviseActive(state, devise) {
      state.deviseActive = devise;
    }
  },
  actions: {
    // Récupère les devises populaires depuis l'API
    async chargerDevisesPopulaires({ commit }) {
      try {
        const reponse = await axios.get('/devises/populaires');
        commit('setListeDevises', reponse.data);
      } catch (e) {
        // Gestion d'erreur possible ici
        commit('setListeDevises', []);
      }
    },
    // Récupère les informations d'une devise spécifique
    async chargerDevise({ commit }, nom) {
      const reponse = await axios.get(`/devises/${nom}`);
      commit('setDeviseActive', reponse.data);
    }
  }
};