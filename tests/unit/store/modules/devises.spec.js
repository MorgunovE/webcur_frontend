const fs = require('fs');
const path = require('path');
import * as devisesApi from '@/api/devises';
import devisesModule from '@/store/modules/devises';

jest.mock('@/api/devises');

const logDir = path.resolve(__dirname, '../../../logs');
const logPath = path.join(logDir, 'unit-test-results.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function logResult(message) {
  const now = new Date().toISOString();
  fs.appendFileSync(logPath, `[${now}] ${message}\n`);
}

describe('Module Vuex devises', () => {
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

  testWithLog('chargerDevisesPopulaires doit appeler recupererDevisesPopulaires et commit', async () => {
    const commit = jest.fn();
    devisesApi.recupererDevisesPopulaires.mockResolvedValue({ data: [{ nom: 'EUR' }] });
    await devisesModule.actions.chargerDevisesPopulaires({ commit });
    expect(devisesApi.recupererDevisesPopulaires).toHaveBeenCalled();
    expect(commit).toHaveBeenCalledWith('setListeDevises', [{ nom: 'EUR' }]);
  });

  testWithLog('chargerDevisesPopulaires doit commit [] en cas d\'erreur', async () => {
    const commit = jest.fn();
    devisesApi.recupererDevisesPopulaires.mockRejectedValue(new Error('fail'));
    await devisesModule.actions.chargerDevisesPopulaires({ commit });
    expect(commit).toHaveBeenCalledWith('setListeDevises', []);
  });

  testWithLog('chargerDevise doit appeler recupererDevise et commit', async () => {
    const commit = jest.fn();
    const state = { listeDevises: [] };
    devisesApi.recupererDevise.mockResolvedValue({ data: { nom: 'USD' } });
    await devisesModule.actions.chargerDevise({ commit, state }, 'USD');
    expect(devisesApi.recupererDevise).toHaveBeenCalledWith('USD');
    expect(commit).toHaveBeenCalledWith('setDeviseActive', { nom: 'USD' });
    expect(commit).toHaveBeenCalledWith('setListeDevises', [{ nom: 'USD' }]);
  });

  testWithLog('convertirDevise doit appeler convertirDevise et commit', async () => {
    const commit = jest.fn();
    const payload = { code_source: 'USD', code_cible: 'EUR', montant: 10 };
    devisesApi.convertirDevise.mockResolvedValue({ data: { resultat: 9 } });
    const res = await devisesModule.actions.convertirDevise({ commit }, payload);
    expect(devisesApi.convertirDevise).toHaveBeenCalledWith(payload);
    expect(commit).toHaveBeenCalledWith('setConversionResultat', { resultat: 9 });
    expect(res).toEqual({ resultat: 9 });
  });

  testWithLog('chargerDevisesFavoris doit appeler recupererDevisesFavoris et commit', async () => {
    const commit = jest.fn();
    const rootState = { auth: { token: 'tok' } };
    devisesApi.recupererDevisesFavoris.mockResolvedValue({ data: { favoris: ['USD'] } });
    await devisesModule.actions.chargerDevisesFavoris({ commit, rootState });
    expect(devisesApi.recupererDevisesFavoris).toHaveBeenCalled();
    expect(commit).toHaveBeenCalledWith('setDevisesFavoris', ['USD']);
  });

  testWithLog('chargerDevisesFavoris doit commit [] si pas de token', async () => {
    const commit = jest.fn();
    const rootState = { auth: { token: null } };
    await devisesModule.actions.chargerDevisesFavoris({ commit, rootState });
    expect(commit).toHaveBeenCalledWith('setDevisesFavoris', []);
  });

  testWithLog('ajouterDeviseFavori doit appeler ajouterDeviseFavori et chargerDevisesFavoris', async () => {
    const dispatch = jest.fn();
    devisesApi.ajouterDeviseFavori.mockResolvedValue({});
    await devisesModule.actions.ajouterDeviseFavori({ dispatch }, 'EUR');
    expect(devisesApi.ajouterDeviseFavori).toHaveBeenCalledWith('EUR');
    expect(dispatch).toHaveBeenCalledWith('chargerDevisesFavoris');
  });

  testWithLog('supprimerDeviseFavori doit appeler supprimerDeviseFavori et chargerDevisesFavoris', async () => {
    const dispatch = jest.fn();
    devisesApi.supprimerDeviseFavori.mockResolvedValue({});
    await devisesModule.actions.supprimerDeviseFavori({ dispatch }, 'USD');
    expect(devisesApi.supprimerDeviseFavori).toHaveBeenCalledWith('USD');
    expect(dispatch).toHaveBeenCalledWith('chargerDevisesFavoris');
  });

  testWithLog('chargerHistoriqueDevise doit appeler recupererHistoriqueDevise et commit', async () => {
    const commit = jest.fn();
    devisesApi.recupererHistoriqueDevise.mockResolvedValue({ data: [{ date: '2025-06-10' }] });
    await devisesModule.actions.chargerHistoriqueDevise({ commit }, { nom: 'USD', jours: 10 });
    expect(devisesApi.recupererHistoriqueDevise).toHaveBeenCalledWith('USD', 10);
    expect(commit).toHaveBeenCalledWith('setHistoriqueDevise', [{ date: '2025-06-10' }]);
  });
});