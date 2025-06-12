// src/store/modules/auth.js
import axios from '../../api/axios';

export default {
  namespaced: true,
  state: {
    utilisateur: null, // Informations de l'utilisateur connecté
    token: localStorage.getItem('token') || null // Token JWT (persisté)
  },
  mutations: {
    setUtilisateur(state, utilisateur) {
      state.utilisateur = utilisateur;
    },
    setToken(state, token) {
      state.token = token;
    },
    deconnexion(state) {
      state.utilisateur = null;
      state.token = null;
    }
  },
  actions: {
    // Connexion de l'utilisateur via l'API
    async connexion({ commit }, identifiants) {
      try {
        const reponse = await axios.post('/connexion', identifiants);
        commit('setUtilisateur', {
          id: reponse.data.id,
          nom_utilisateur: reponse.data.nom_utilisateur,
          email: identifiants.email
        });
        commit('setToken', reponse.data.access_token);
        // Stockage du token dans localStorage pour persistance
        localStorage.setItem('token', reponse.data.access_token);
        return true;
      } catch (erreur) {
        // Gestion de l'erreur (mauvais identifiants, etc.)
        commit('deconnexion');
        localStorage.removeItem('token');
        return false;
      }
    },
    // Déconnexion de l'utilisateur
    async deconnexion({ commit }) {
      try {
        await axios.post('/deconnexion');
      } catch (e) {
        // Même en cas d'échec, on nettoie le store
      }
      commit('deconnexion');
      localStorage.removeItem('token');
    }
  }
};