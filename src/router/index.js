// Importation des fonctions nécessaires de vue-router
import { createRouter, createWebHistory } from "vue-router";

// Importation de la vue d'accueil (chargement direct)
import AccueilView from "../views/AccueilView.vue";

// Définition des routes de l'application
const routes = [
  {
    path: "/", // Page d'accueil
    name: "Accueil",
    component: AccueilView
  },
  {
    path: "/login", // Page de connexion
    name: "Connexion",
    // Chargement dynamique pour optimiser le bundle
    component: () => import("../views/ConnexionView.vue")
  },
  {
    path: "/register", // Page d'enregistrement
    name: "Enregistrement",
    component: () => import("../views/EnregistrementView.vue")
  },
  {
    path: "/currencies/:pair", // Page d'une devise (ex: USD-EUR)
    name: "Devise",
    component: () => import("../views/DeviseView.vue"),
    props: true // Permet de passer le paramètre 'pair' comme prop
  },
  {
    path: "/companies/:symbol", // Page d'une entreprise (ex: AAPL)
    name: "Entreprise",
    component: () => import("../views/EntrepriseView.vue"),
    props: true // Permet de passer le paramètre 'symbol' comme prop
  },
  {
    path: "/account", // Page du compte utilisateur
    name: "Compte",
    component: () => import("../views/CompteView.vue")
  }
];

// Création et exportation du routeur
export default createRouter({
  history: createWebHistory(), // Utilisation du mode HTML5 history
  routes // Liste des routes définies ci-dessus
});