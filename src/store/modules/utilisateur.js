import {
  inscrireUtilisateur,
  recupererUtilisateurs,
  recupererUtilisateur,
  mettreAJourUtilisateur,
  supprimerUtilisateur,
} from "../../api/utilisateur";

export default {
  namespaced: true,
  state: {
    utilisateurs: [],
    utilisateurActif: null,
  },
  mutations: {
    setUtilisateurs(state, utilisateurs) {
      state.utilisateurs = utilisateurs;
    },
    setUtilisateurActif(state, utilisateur) {
      state.utilisateurActif = utilisateur;
    },
  },
  actions: {
    async inscription(_, donnees) {
      return inscrireUtilisateur(donnees);
    },
    async chargerUtilisateurs({ commit }) {
      const reponse = await recupererUtilisateurs();
      commit("setUtilisateurs", reponse.data);
    },
    async chargerUtilisateur({ commit }, id) {
      const reponse = await recupererUtilisateur(id);
      commit("setUtilisateurActif", reponse.data);
    },
    async mettreAJourUtilisateur(_, { id, donnees }) {
      return mettreAJourUtilisateur(id, donnees);
    },
    async supprimerUtilisateur(_, id) {
      return supprimerUtilisateur(id);
    },
  },
};
