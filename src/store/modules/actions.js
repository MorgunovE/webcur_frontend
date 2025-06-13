import {
  ajouterActionFavori,
  calculerAchatAction,
  recupererAction,
  recupererActionsFavoris,
  recupererActionsPopulaires,
  recupererHistoriqueAction,
  supprimerActionFavori,
} from "../../api/actions";

function getLocalToday() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default {
  namespaced: true,
  state: {
    actionActive: null,
    historique: [],
    actionsPopulaires: [],
    actionsFavoris: [],
  },
  mutations: {
    setActionActive(state, action) {
      state.actionActive = action;
    },
    setHistorique(state, historique) {
      state.historique = historique;
    },
    setActionsPopulaires(state, actions) {
      state.actionsPopulaires = actions;
    },
    setActionsFavoris(state, favoris) {
      state.actionsFavoris = favoris;
    },
  },
  actions: {
    async chargerAction({ commit }, { symbole, date }) {
      // Utilise la date actuelle si aucune n'est fournie
      if (!date) {
        date = getLocalToday();
      }
      const res = await recupererAction(symbole, date);
      commit("setActionActive", res.data);
    },
    async chargerHistorique({ commit }, { symbole, jours = 7 }) {
      const res = await recupererHistoriqueAction(symbole, jours);
      commit("setHistorique", res.data);
    },
    async calculerAchat(_, payload) {
      const res = await calculerAchatAction(payload);
      return res.data;
    },
    async chargerActionsPopulaires({ commit }) {
      const res = await recupererActionsPopulaires();
      commit("setActionsPopulaires", res.data);
    },
    async chargerActionsFavoris({ commit }) {
      const res = await recupererActionsFavoris();
      commit("setActionsFavoris", res.data.favoris);
    },
    async ajouterActionFavori({ dispatch }, symbole) {
      await ajouterActionFavori(symbole);
      await dispatch("chargerActionsFavoris");
    },
    async supprimerActionFavori({ dispatch }, symbole) {
      await supprimerActionFavori(symbole);
      await dispatch("chargerActionsFavoris");
    },
  },
};
