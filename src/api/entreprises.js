import axios from "./axios";

// Récupérer la liste des entreprises populaires
export function recupererEntreprisesPopulaires() {
  return axios.get("/societes/populaires");
}

// Récupérer les détails d'une entreprise par symbole
export function recupererEntreprise(symbole) {
  return axios.get(`/societes/${symbole}`);
}

// Récupérer l'historique d'une entreprise (par défaut 30 jours)
export function recupererHistoriqueEntreprise(symbole, jours = 30) {
  return axios.get(`/societes/${symbole}/historique?jours=${jours}`);
}
