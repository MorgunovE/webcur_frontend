import { createStore } from 'vuex';

// Importation des modules Vuex
import auth from './modules/auth';
import devises from './modules/devises';
import entreprises from './modules/entreprises';
import favoris from './modules/favoris';

// Création du store principal avec les modules
export default createStore({
  modules: {
    auth,
    devises,
    entreprises,
    favoris
  }
});