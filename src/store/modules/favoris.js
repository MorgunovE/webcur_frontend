import { recupererDevisesFavoris, ajouterDeviseFavori, supprimerDeviseFavori } from '../../api/devises';

export default {
  namespaced: true,
  state: {
    devisesFavoris: []
  },
  mutations: {
    setDevisesFavoris(state, favoris) {
      state.devisesFavoris = favoris;
    }
  },
  actions: {
    // Charge les devises favorites de l'utilisateur
    async chargerDevisesFavoris({ commit }) {
      const reponse = await recupererDevisesFavoris();
      commit('setDevisesFavoris', reponse.data.favoris);
    },
    // Ajoute une devise aux favoris
    async ajouterFavori({ dispatch }, nom_devise) {
      await ajouterDeviseFavori(nom_devise);
      await dispatch('chargerDevisesFavoris');
    },
    // Supprime une devise des favoris
    async supprimerFavori({ dispatch }, nom_devise) {
      await supprimerDeviseFavori(nom_devise);
      await dispatch('chargerDevisesFavoris');
    },
  }
};