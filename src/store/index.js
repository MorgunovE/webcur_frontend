import { createStore } from 'vuex';
import auth from './modules/auth';
import utilisateur from './modules/utilisateur';
import devises from './modules/devises';
import entreprises from './modules/entreprises';
import actions from './modules/actions';

export default createStore({
  modules: {
    auth,
    utilisateur,
    devises,
    entreprises,
    actions
  }
});