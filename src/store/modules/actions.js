import {
  ajouterActionFavori,
  calculerAchatAction,
  recupererAction,
  recupererActionsFavoris,
  recupererActionsPopulaires,
  recupererHistoriqueAction,
  supprimerActionFavori,
} from "../../api/actions";

export default {
  namespaced: true,
  state: {
    actionActive: null,
    historique: [],
    actionsPopulaires: [],
    actionsFavoris: [],
    cache: {}, // { [symbole_date]: actionData }
  },
  mutations: {
    setActionActive(state, { symbole, date, action }) {
      state.actionActive = action;
      state.cache[`${symbole}_${date}`] = action;
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
    async chargerAction({ state, commit }, { symbole, date }) {
      const cacheKey = `${symbole}_${date}`;
      if (state.cache[cacheKey]) {
        commit("setActionActive", {
          symbole,
          date,
          action: state.cache[cacheKey],
        });
        return;
      }
      const res = await recupererAction(symbole, date);
      commit("setActionActive", { symbole, date, action: res.data });
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
