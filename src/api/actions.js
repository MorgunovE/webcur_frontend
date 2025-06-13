import axios from "./axios";

// Obtenir la liste des actions populaires
export function recupererAction(symbole, date = null) {
  return axios.get(`/actions/${symbole}?date=${date}`);
}

// Obtenir l'historique d'une action (par défaut 7 jours)
export function recupererHistoriqueAction(symbole, jours = 7) {
  return axios.get(`/actions/${symbole}/historique?jours=${jours}`);
}

// Calculer le prix d'achat d'une action
export function calculerAchatAction(payload) {
  // payload: { symbole, date, quantite, code_devise }
  return axios.post("/actions/calculer", payload);
}

// Récupérer les actions populaires
export function recupererActionsPopulaires() {
  return axios.get("/actions/populaires");
}

// Gérer les actions favorites (nécessite le token JWT)
export function recupererActionsFavoris() {
  return axios.get("/actions/favoris");
}
export function ajouterActionFavori(symbole) {
  return axios.post("/actions/favoris", { symbole });
}
export function supprimerActionFavori(symbole) {
  return axios.delete("/actions/favoris", { data: { symbole } });
}
