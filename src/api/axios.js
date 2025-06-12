import axios from 'axios';

// Création d'une instance Axios avec l'URL de base de l'API
const instance = axios.create({
  baseURL: 'http://localhost:5000', // À adapter selon l'environnement
  headers: { 'Content-Type': 'application/json' }
});

// (Optionnel) Ajouter un intercepteur pour le token JWT plus tard

export default instance;