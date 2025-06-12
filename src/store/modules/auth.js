import {
  connecterUtilisateur
} from '../../api/utilisateur';

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
        const reponse = await connecterUtilisateur(identifiants);
        commit('setUtilisateur', {
          id: reponse.data.id,
          nom_utilisateur: reponse.data.nom_utilisateur,
          email: identifiants.email
        });
        commit('setToken', reponse.data.access_token);
        localStorage.setItem('token', reponse.data.access_token);
        return true;
      } catch (erreur) {
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