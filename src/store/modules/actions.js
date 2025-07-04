import {
  ajouterActionFavori,
  calculerAchatAction,
  recupererAction,
  recupererActionsFavoris,
  recupererActionsPopulaires,
  recupererHistoriqueAction,
  supprimerActionFavori,
} from "../../api/actions";
import {recupererDevisesFavoris} from "@/api/devises";

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
    async chargerActionsFavoris({ commit, rootState }) {
      if (!rootState.auth.token) {
        commit("setActionsFavoris", []);
        return;
      }
      try {
        const res = await recupererActionsFavoris();
        commit("setActionsFavoris", res.data.favoris);
      } catch (e) {
        if (e.response && e.response.status === 401) {
          commit("setActionsFavoris", []);
        } else {
          throw e;
        }
      }
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
