const fs = require('fs');
const path = require('path');
import * as devisesApi from '@/api/devises';
import favorisModule from '@/store/modules/favoris';

jest.mock('@/api/devises');

const logDir = path.resolve(__dirname, '../../../logs');
const logPath = path.join(logDir, 'test-results.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function logResult(message) {
  const now = new Date().toISOString();
  fs.appendFileSync(logPath, `[${now}] ${message}\n`);
}

describe('Module Vuex favoris', () => {
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

  testWithLog('setDevisesFavoris doit mettre à jour le state', async () => {
    const state = { devisesFavoris: [] };
    favorisModule.mutations.setDevisesFavoris(state, ['EUR', 'USD']);
    expect(state.devisesFavoris).toEqual(['EUR', 'USD']);
  });

  testWithLog('chargerDevisesFavoris doit appeler recupererDevisesFavoris et commit', async () => {
    const commit = jest.fn();
    devisesApi.recupererDevisesFavoris.mockResolvedValue({ data: { favoris: ['EUR', 'USD'] } });
    await favorisModule.actions.chargerDevisesFavoris({ commit });
    expect(devisesApi.recupererDevisesFavoris).toHaveBeenCalled();
    expect(commit).toHaveBeenCalledWith('setDevisesFavoris', ['EUR', 'USD']);
  });

  testWithLog('ajouterFavori doit appeler ajouterDeviseFavori et chargerDevisesFavoris', async () => {
    const dispatch = jest.fn();
    devisesApi.ajouterDeviseFavori.mockResolvedValue({});
    await favorisModule.actions.ajouterFavori({ dispatch }, 'EUR');
    expect(devisesApi.ajouterDeviseFavori).toHaveBeenCalledWith('EUR');
    expect(dispatch).toHaveBeenCalledWith('chargerDevisesFavoris');
  });

  testWithLog('supprimerFavori doit appeler supprimerDeviseFavori et chargerDevisesFavoris', async () => {
    const dispatch = jest.fn();
    devisesApi.supprimerDeviseFavori.mockResolvedValue({});
    await favorisModule.actions.supprimerFavori({ dispatch }, 'USD');
    expect(devisesApi.supprimerDeviseFavori).toHaveBeenCalledWith('USD');
    expect(dispatch).toHaveBeenCalledWith('chargerDevisesFavoris');
  });
});