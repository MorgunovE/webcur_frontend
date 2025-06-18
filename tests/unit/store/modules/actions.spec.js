const fs = require('fs');
const path = require('path');
import * as actionsApi from '@/api/actions';
import actionsModule from '@/store/modules/actions';

jest.mock('@/api/actions');

const logDir = path.resolve(__dirname, '../../../logs');
const logPath = path.join(logDir, 'unit-test-results.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function logResult(message) {
  const now = new Date().toISOString();
  fs.appendFileSync(logPath, `[${now}] ${message}\n`);
}

describe('Module Vuex actions', () => {
  function testWithLog(name, fn) {
    test(name, async () => {
      let status = 'RÉUSSI';
      try {
        await fn();
      } catch (e) {
        status = 'ÉCHEC';
        logResult(`${name} - ${status} - ${e.message}`);
        throw e;
      }
      logResult(`${name} - ${status}`);
    });
  }

  testWithLog('chargerAction doit appeler recupererAction et commit', async () => {
    const commit = jest.fn();
    actionsApi.recupererAction.mockResolvedValue({ data: { symbole: 'AAPL' } });
    await actionsModule.actions.chargerAction({ commit }, { symbole: 'AAPL', date: '2025-06-10' });
    expect(actionsApi.recupererAction).toHaveBeenCalledWith('AAPL', '2025-06-10');
    expect(commit).toHaveBeenCalledWith('setActionActive', { symbole: 'AAPL' });
  });

  testWithLog('chargerHistorique doit appeler recupererHistoriqueAction et commit', async () => {
    const commit = jest.fn();
    actionsApi.recupererHistoriqueAction.mockResolvedValue({ data: [{ date: '2025-06-10' }] });
    await actionsModule.actions.chargerHistorique({ commit }, { symbole: 'AAPL', jours: 7 });
    expect(actionsApi.recupererHistoriqueAction).toHaveBeenCalledWith('AAPL', 7);
    expect(commit).toHaveBeenCalledWith('setHistorique', [{ date: '2025-06-10' }]);
  });

  testWithLog('calculerAchat doit appeler calculerAchatAction', async () => {
    const payload = { symbole: 'AAPL', date: '2025-06-10', quantite: 2, code_devise: 'EUR' };
    actionsApi.calculerAchatAction.mockResolvedValue({ data: { total: 100 } });
    const res = await actionsModule.actions.calculerAchat({}, payload);
    expect(actionsApi.calculerAchatAction).toHaveBeenCalledWith(payload);
    expect(res).toEqual({ total: 100 });
  });

  testWithLog('chargerActionsPopulaires doit appeler recupererActionsPopulaires et commit', async () => {
    const commit = jest.fn();
    actionsApi.recupererActionsPopulaires.mockResolvedValue({ data: [{ symbole: 'AAPL' }] });
    await actionsModule.actions.chargerActionsPopulaires({ commit });
    expect(actionsApi.recupererActionsPopulaires).toHaveBeenCalled();
    expect(commit).toHaveBeenCalledWith('setActionsPopulaires', [{ symbole: 'AAPL' }]);
  });

  testWithLog('chargerActionsFavoris doit appeler recupererActionsFavoris et commit', async () => {
    const commit = jest.fn();
    actionsApi.recupererActionsFavoris.mockResolvedValue({ data: { favoris: ['AAPL'] } });
    const rootState = { auth: { token: 'abc' } };
    await actionsModule.actions.chargerActionsFavoris({ commit, rootState });
    expect(actionsApi.recupererActionsFavoris).toHaveBeenCalled();
    expect(commit).toHaveBeenCalledWith('setActionsFavoris', ['AAPL']);
  });

  testWithLog('ajouterActionFavori doit appeler ajouterActionFavori et chargerActionsFavoris', async () => {
    const dispatch = jest.fn();
    actionsApi.ajouterActionFavori.mockResolvedValue({});
    await actionsModule.actions.ajouterActionFavori({ dispatch }, 'AAPL');
    expect(actionsApi.ajouterActionFavori).toHaveBeenCalledWith('AAPL');
    expect(dispatch).toHaveBeenCalledWith('chargerActionsFavoris');
  });

  testWithLog('supprimerActionFavori doit appeler supprimerActionFavori et chargerActionsFavoris', async () => {
    const dispatch = jest.fn();
    actionsApi.supprimerActionFavori.mockResolvedValue({});
    await actionsModule.actions.supprimerActionFavori({ dispatch }, 'AAPL');
    expect(actionsApi.supprimerActionFavori).toHaveBeenCalledWith('AAPL');
    expect(dispatch).toHaveBeenCalledWith('chargerActionsFavoris');
  });
});