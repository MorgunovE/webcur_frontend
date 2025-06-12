import axios from "./axios";

// Inscription d'un nouvel utilisateur
export function inscrireUtilisateur(donnees) {
  // donnees : { email, mot_de_passe, nom_utilisateur }
  return axios.post("/utilisateurs", donnees);
}

// Connexion d'un utilisateur
export function connecterUtilisateur(identifiants) {
  // identifiants : { email, mot_de_passe }
  return axios.post("/connexion", identifiants);
}

// Récupérer la liste des utilisateurs
export function recupererUtilisateurs() {
  return axios.get("/utilisateurs");
}

// Récupérer un utilisateur par ID
export function recupererUtilisateur(id) {
  return axios.get(`/utilisateurs/${id}`);
}

// Mettre à jour un utilisateur (nécessite le token JWT dans l'en-tête)
export function mettreAJourUtilisateur(id, donnees) {
  return axios.put(`/utilisateurs/${id}`, donnees);
}

// Supprimer un utilisateur (nécessite le token JWT)
export function supprimerUtilisateur(id) {
  return axios.delete(`/utilisateurs/${id}`);
}
