import { createRouter, createWebHistory } from 'vue-router';
import AccueilView from '../views/AccueilView.vue';
// ...importer les autres vues
import store from '../store';

const routes = [
  { path: '/', name: 'Accueil', component: AccueilView },
  { path: '/login', name: 'Connexion', component: () => import('../views/ConnexionView.vue') },
  { path: '/register', name: 'Enregistrement', component: () => import('../views/EnregistrementView.vue') },
  { path: '/currencies/:pair', name: 'Devise', component: () => import('../views/DeviseView.vue') },
  { path: '/companies/:symbol', name: 'Entreprise', component: () => import('../views/EntrepriseView.vue') },
  {
    path: '/account',
    name: 'Compte',
    component: () => import('../views/CompteView.vue'),
    meta: { requiresAuth: true } // Cette route nécessite l'authentification
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Garde de navigation pour protéger les routes privées
router.beforeEach((to, from, next) => {
  const estAuthentifie = !!store.state.auth.token;
  if (to.meta.requiresAuth && !estAuthentifie) {
    // Redirige vers la page de connexion si non authentifié
    next({ name: 'Connexion' });
  } else {
    next();
  }
});

export default router;