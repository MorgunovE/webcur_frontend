import axios from '../../api/axios';
import {recupererDevise, recupererDevisesPopulaires} from '../../api/devises';

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
        const reponse = await recupererDevisesPopulaires();
        commit('setListeDevises', reponse.data);
      } catch (e) {
        commit('setListeDevises', []);
      }
    },
    // Récupère les informations d'une devise spécifique
    async chargerDevise({ commit }, nom) {
      const reponse = await recupererDevise(nom);
      commit('setDeviseActive', reponse.data);
    }
  }
};