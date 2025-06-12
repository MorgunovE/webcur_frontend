import axios from 'axios';

// Création d'une instance Axios avec l'URL de base de l'API
const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// (Optionnel) Ajouter un intercepteur pour le token JWT plus tard

export default instance;