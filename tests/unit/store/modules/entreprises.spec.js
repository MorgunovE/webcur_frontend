const fs = require('fs');
const path = require('path');
import * as entreprisesApi from '@/api/entreprises';
import entreprisesModule from '@/store/modules/entreprises';

jest.mock('@/api/entreprises');

const logDir = path.resolve(__dirname, '../../../logs');
const logPath = path.join(logDir, 'unit-test-results.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function logResult(message) {
  const now = new Date().toISOString();
  fs.appendFileSync(logPath, `[${now}] ${message}\n`);
}

describe('Module Vuex entreprises', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  testWithLog('chargerEntreprisesPopulaires doit appeler recupererEntreprisesPopulaires et commit', async () => {
    const commit = jest.fn();
    entreprisesApi.recupererEntreprisesPopulaires.mockResolvedValue({ data: [{ symbole: 'AAPL' }] });
    await entreprisesModule.actions.chargerEntreprisesPopulaires({ commit });
    expect(entreprisesApi.recupererEntreprisesPopulaires).toHaveBeenCalled();
    expect(commit).toHaveBeenCalledWith('setEntreprisesPopulaires', [{ symbole: 'AAPL' }]);
  });

  testWithLog('chargerEntreprise doit appeler recupererEntreprise et commit si token', async () => {
    const commit = jest.fn();
    const rootState = { auth: { token: 'tok' } };
    entreprisesApi.recupererEntreprise.mockResolvedValue({ data: { symbole: 'AAPL' } });
    await entreprisesModule.actions.chargerEntreprise({ commit, rootState }, 'AAPL');
    expect(entreprisesApi.recupererEntreprise).toHaveBeenCalledWith('AAPL');
    expect(commit).toHaveBeenCalledWith('setEntrepriseActive', { symbole: 'AAPL' });
  });

  testWithLog('chargerEntreprise doit commit null si pas de token', async () => {
    const commit = jest.fn();
    const rootState = { auth: { token: null } };
    await entreprisesModule.actions.chargerEntreprise({ commit, rootState }, 'AAPL');
    expect(commit).toHaveBeenCalledWith('setEntrepriseActive', null);
    expect(entreprisesApi.recupererEntreprise).not.toHaveBeenCalled();
  });

  testWithLog('chargerHistoriqueEntreprise doit appeler recupererHistoriqueEntreprise et commit', async () => {
    const commit = jest.fn();
    entreprisesApi.recupererHistoriqueEntreprise.mockResolvedValue({ data: [{ date: '2025-06-10' }] });
    await entreprisesModule.actions.chargerHistoriqueEntreprise({ commit }, { symbole: 'AAPL', jours: 7 });
    expect(entreprisesApi.recupererHistoriqueEntreprise).toHaveBeenCalledWith('AAPL', 7);
    expect(commit).toHaveBeenCalledWith('setHistoriqueEntreprise', [{ date: '2025-06-10' }]);
  });

  testWithLog('chargerHistoriqueEntreprise doit commit [] en cas d\'erreur', async () => {
    const commit = jest.fn();
    entreprisesApi.recupererHistoriqueEntreprise.mockRejectedValue(new Error('fail'));
    await entreprisesModule.actions.chargerHistoriqueEntreprise({ commit }, { symbole: 'AAPL', jours: 7 });
    expect(commit).toHaveBeenCalledWith('setHistoriqueEntreprise', []);
  });
});