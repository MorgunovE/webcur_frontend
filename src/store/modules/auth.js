import { connecterUtilisateur } from "../../api/utilisateur";
import axios from "axios";

export default {
  namespaced: true,
  state: {
    utilisateur: null, // Informations de l'utilisateur connecté
    token: localStorage.getItem("token") || null, // Token JWT (persisté)
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
    },
  },
  actions: {
    // Connexion de l'utilisateur via l'API
    async connexion({ commit }, identifiants) {
      try {
        const reponse = await connecterUtilisateur(identifiants);
        commit("setUtilisateur", {
          id: reponse.data.id,
          nom_utilisateur: reponse.data.nom_utilisateur,
          email: identifiants.email,
        });
        commit("setToken", reponse.data.access_token);
        localStorage.setItem("token", reponse.data.access_token);
        localStorage.setItem("user_id", reponse.data.id);
        return true;
      } catch (erreur) {
        commit("deconnexion");
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        return false;
      }
    },
    // Déconnexion de l'utilisateur
    async deconnexion({ commit }) {
      try {
        await axios.post("/deconnexion");
      } catch (e) {
        // Même en cas d'échec, on nettoie le store
      }
      commit("deconnexion");
      localStorage.removeItem("token");
    },
    async reconnect({ commit, state }) {
      const token = state.token;
      if (!token) return false;
      try {
        // Try to access a protected endpoint
        await axios.get("/devises/favoris", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // If successful, token is valid
        return true;
      } catch (e) {
        // Token invalid or expired
        commit("deconnexion");
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        return false;
      }
    },
  },
};
