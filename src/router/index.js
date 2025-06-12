import { createRouter, createWebHistory } from "vue-router";

import AccueilView from "../views/AccueilView.vue";
import ConnexionView from "../views/ConnexionView.vue";
import EnregistrementView from "../views/EnregistrementView.vue";
import CompteView from "../views/CompteView.vue";
import DeviseView from "../views/DeviseView.vue";
import EntrepriseView from "../views/EntrepriseView.vue";
import ActionView from "../views/ActionView.vue";
import store from "@/store";

const routes = [
  { path: "/", name: "Accueil", component: AccueilView },
  { path: "/login", name: "Connexion", component: ConnexionView },
  { path: "/register", name: "Inscription", component: EnregistrementView },
  {
    path: "/account",
    name: "Compte",
    component: CompteView,
    meta: { requiresAuth: true },
  },
  { path: "/currencies/:pair", name: "Devise", component: DeviseView },
  {
    path: "/companies/:symbole",
    name: "Entreprise",
    component: EntrepriseView,
    meta: { requiresAuth: true },
  },
  { path: "/stocks/:symbole", name: "Action", component: ActionView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation pour vérifier l'authentification
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = store.state.auth.token || localStorage.getItem("token");
    if (!token) {
      return next("/login");
    }
  }
  next();
});

export default router;
