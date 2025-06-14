import { connecterUtilisateur } from "../../api/utilisateur";
import axios from "../../api/axios";

const token = localStorage.getItem("token");
const utilisateur = token ? JSON.parse(localStorage.getItem("utilisateur")) : null;

if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default {
  namespaced: true,
  state: {
    utilisateur: utilisateur || null, // Informations de l'utilisateur connecté
    token: token || null, // Token JWT (persisté)
  },
  mutations: {
    setUtilisateur(state, utilisateur) {
      state.utilisateur = utilisateur;
      if (utilisateur) {
        localStorage.setItem("utilisateur", JSON.stringify(utilisateur));
      } else {
        localStorage.removeItem("utilisateur");
      }
    },
    setToken(state, token) {
      state.token = token;
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        delete axios.defaults.headers.common["Authorization"];
      }
    },
    deconnexion(state) {
      state.utilisateur = null;
      state.token = null;
      localStorage.removeItem("utilisateur");
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      delete axios.defaults.headers.common["Authorization"];
    },
  },
  actions: {
    // Connexion de l'utilisateur via l'API
    async connexion({ commit }, identifiants) {
      try {
        const reponse = await connecterUtilisateur(identifiants);
        const user = {
          id: reponse.data.id,
          nom_utilisateur: reponse.data.nom_utilisateur,
          email: identifiants.email,
        };
        commit("setUtilisateur", user);
        commit("setToken", reponse.data.access_token);
        localStorage.setItem("token", reponse.data.access_token);
        localStorage.setItem("user_id", reponse.data.id);
        return true;
      } catch (erreur) {
        commit("deconnexion");
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
    },
    async reconnect({ commit, state }) {
      const token = state.token;
      if (!token) return false;
      try {
        // Vérification du token en faisant une requête simple
        await axios.get("/devises/favoris", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Si la requête réussit, on suppose que le token est valide
        return true;
      } catch (e) {
        // Si la requête échoue, on considère que le token n'est plus valide
        commit("deconnexion");
        return false;
      }
    },
  },
};
