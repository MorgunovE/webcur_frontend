import axios from '../../api/axios';

export default {
  namespaced: true,
  state: {
    devisesFavoris: [],
    entreprisesFavoris: []
  },
  mutations: {
    setDevisesFavoris(state, favoris) {
      state.devisesFavoris = favoris;
    },
    setEntreprisesFavoris(state, favoris) {
      state.entreprisesFavoris = favoris;
    }
  },
  actions: {
    // Charge les devises favorites de l'utilisateur
    async chargerDevisesFavoris({ commit, rootState }) {
      if (!rootState.auth.token) return;
      const reponse = await axios.get('/devises/favoris', {
        headers: { Authorization: `Bearer ${rootState.auth.token}` }
      });
      commit('setDevisesFavoris', reponse.data.favoris);
    },
    // Ajoute une devise aux favoris
    async ajouterDeviseFavori({ dispatch, rootState }, nom_devise) {
      await axios.post('/devises/favoris', { nom_devise }, {
        headers: { Authorization: `Bearer ${rootState.auth.token}` }
      });
      dispatch('chargerDevisesFavoris');
    },
    // Supprime une devise des favoris
    async supprimerDeviseFavori({ dispatch, rootState }, nom_devise) {
      await axios.delete('/devises/favoris', {
        data: { nom_devise },
        headers: { Authorization: `Bearer ${rootState.auth.token}` }
      });
      dispatch('chargerDevisesFavoris');
    },
    // Charge les entreprises favorites (exemple, à adapter selon l’API)
    async chargerEntreprisesFavoris({ commit, rootState }) {
      if (!rootState.auth.token) return;
      const reponse = await axios.get('/actions/favoris', {
        headers: { Authorization: `Bearer ${rootState.auth.token}` }
      });
      commit('setEntreprisesFavoris', reponse.data.favoris);
    },
    // Ajoute une entreprise aux favoris
    async ajouterEntrepriseFavori({ dispatch, rootState }, symbole) {
      await axios.post('/actions/favoris', { symbole }, {
        headers: { Authorization: `Bearer ${rootState.auth.token}` }
      });
      dispatch('chargerEntreprisesFavoris');
    },
    // Supprime une entreprise des favoris
    async supprimerEntrepriseFavori({ dispatch, rootState }, symbole) {
      await axios.delete('/actions/favoris', {
        data: { symbole },
        headers: { Authorization: `Bearer ${rootState.auth.token}` }
      });
      dispatch('chargerEntreprisesFavoris');
    }
  }
};