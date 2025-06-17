const fs = require('fs');
const path = require('path');
import * as utilisateurApi from '@/api/utilisateur';
import utilisateurModule from '@/store/modules/utilisateur';

jest.mock('@/api/utilisateur');

const logDir = path.resolve(__dirname, '../../../logs');
const logPath = path.join(logDir, 'test-results.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function logResult(message) {
  const now = new Date().toISOString();
  fs.appendFileSync(logPath, `[${now}] ${message}\n`);
}

describe('Module Vuex utilisateur', () => {
  function testWithLog(nom, fn) {
    test(nom, async () => {
      let status = 'RÉUSSI';
      try {
        await fn();
      } catch (e) {
        status = 'ÉCHEC';
        logResult(`${nom} - ${status} - ${e.message}`);
        throw e;
      }
      logResult(`${nom} - ${status}`);
    });
  }

  testWithLog('inscription doit appeler inscrireUtilisateur', async () => {
    const donnees = { email: 'test@mail.com', mot_de_passe: '123456' };
    utilisateurApi.inscrireUtilisateur.mockResolvedValue({ data: { id: 1 } });
    const res = await utilisateurModule.actions.inscription({}, donnees);
    expect(utilisateurApi.inscrireUtilisateur).toHaveBeenCalledWith(donnees);
    expect(res).toEqual({ data: { id: 1 } });
  });

  testWithLog('chargerUtilisateurs doit appeler recupererUtilisateurs et commit', async () => {
    const commit = jest.fn();
    utilisateurApi.recupererUtilisateurs.mockResolvedValue({ data: [{ id: 1 }] });
    await utilisateurModule.actions.chargerUtilisateurs({ commit });
    expect(utilisateurApi.recupererUtilisateurs).toHaveBeenCalled();
    expect(commit).toHaveBeenCalledWith('setUtilisateurs', [{ id: 1 }]);
  });

  testWithLog('chargerUtilisateur doit appeler recupererUtilisateur et commit', async () => {
    const commit = jest.fn();
    utilisateurApi.recupererUtilisateur.mockResolvedValue({ data: { id: 2 } });
    await utilisateurModule.actions.chargerUtilisateur({ commit }, 2);
    expect(utilisateurApi.recupererUtilisateur).toHaveBeenCalledWith(2);
    expect(commit).toHaveBeenCalledWith('setUtilisateurActif', { id: 2 });
  });

  testWithLog('mettreAJourUtilisateur doit appeler mettreAJourUtilisateur', async () => {
    const payload = { id: 3, donnees: { nom_utilisateur: 'Nouveau' } };
    utilisateurApi.mettreAJourUtilisateur.mockResolvedValue({ data: { id: 3 } });
    const res = await utilisateurModule.actions.mettreAJourUtilisateur({}, payload);
    expect(utilisateurApi.mettreAJourUtilisateur).toHaveBeenCalledWith(3, { nom_utilisateur: 'Nouveau' });
    expect(res).toEqual({ data: { id: 3 } });
  });

  testWithLog('supprimerUtilisateur doit appeler supprimerUtilisateur', async () => {
    utilisateurApi.supprimerUtilisateur.mockResolvedValue({ data: {} });
    const res = await utilisateurModule.actions.supprimerUtilisateur({}, 4);
    expect(utilisateurApi.supprimerUtilisateur).toHaveBeenCalledWith(4);
    expect(res).toEqual({ data: {} });
  });

  testWithLog('setUtilisateurs mutation doit mettre à jour le state', async () => {
    const state = { utilisateurs: [] };
    utilisateurModule.mutations.setUtilisateurs(state, [{ id: 1 }]);
    expect(state.utilisateurs).toEqual([{ id: 1 }]);
  });

  testWithLog('setUtilisateurActif mutation doit mettre à jour le state', async () => {
    const state = { utilisateurActif: null };
    utilisateurModule.mutations.setUtilisateurActif(state, { id: 2 });
    expect(state.utilisateurActif).toEqual({ id: 2 });
  });
});