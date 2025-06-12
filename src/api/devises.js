import axios from './axios';

// Récupérer les devises populaires
export function recupererDevisesPopulaires() {
  return axios.get('/devises/populaires');
}

// Récupérer les informations d'une devise
export function recupererDevise(nom) {
  return axios.get(`/devises/${nom}`);
}

// Convertir un montant d'une devise à une autre (JWT requis)
export function convertirDevise(payload) {
  // payload : { code_source, code_cible, montant }
  return axios.post('/devises/conversion', payload);
}

// Gérer les favoris (JWT requis)
export function ajouterDeviseFavori(nom_devise) {
  return axios.post('/devises/favoris', { nom_devise });
}

export function supprimerDeviseFavori(nom_devise) {
  return axios.delete('/devises/favoris', { data: { nom_devise } });
}

export function recupererDevisesFavoris() {
  return axios.get('/devises/favoris');
}

export function recupererHistoriqueDevise(nom, jours = 30) {
  return axios.get(`/devises/${nom}/historique?jours=${jours}`);
}