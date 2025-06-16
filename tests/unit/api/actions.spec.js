const fs = require('fs');
const path = require('path');
import axios from '@/api/axios';
import * as actionsApi from '@/api/actions';

jest.mock('@/api/axios');

const logDir = path.resolve(__dirname, '../../logs');
const logPath = path.join(logDir, 'test-results.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function logResult(message) {
  const now = new Date().toISOString();
  fs.appendFileSync(logPath, `[${now}] ${message}\n`);
}

describe('actions API', () => {
  function testWithLog(name, fn) {
    test(name, async () => {
      let status = 'PASSED';
      try {
        await fn();
      } catch (e) {
        status = 'FAILED';
        logResult(`${name} - ${status} - ${e.message}`);
        throw e;
      }
      logResult(`${name} - ${status}`);
    });
  }

  testWithLog('recupererAction obtenir une action spécifique', async () => {
    axios.get.mockResolvedValue({ data: {} });
    await actionsApi.recupererAction('AAPL', '2025-06-10');
    expect(axios.get).toHaveBeenCalledWith('/actions/AAPL?date=2025-06-10');
  });

  testWithLog('recupererHistoriqueAction obtenir l\'historique d\'une action', async () => {
    axios.get.mockResolvedValue({ data: [] });
    await actionsApi.recupererHistoriqueAction('AAPL', 7);
    expect(axios.get).toHaveBeenCalledWith('/actions/AAPL/historique?jours=7');
  });

  testWithLog('calculerAchatAction calculer le prix d\'achat d\'une action', async () => {
    const payload = { symbole: 'AAPL', date: '2025-06-10', quantite: 10, code_devise: 'EUR' };
    axios.post.mockResolvedValue({ data: {} });
    await actionsApi.calculerAchatAction(payload);
    expect(axios.post).toHaveBeenCalledWith('/actions/calculer', payload);
  });

  testWithLog('recupererActionsPopulaires obtenir les actions populaires', async () => {
    axios.get.mockResolvedValue({ data: [] });
    await actionsApi.recupererActionsPopulaires();
    expect(axios.get).toHaveBeenCalledWith('/actions/populaires');
  });

  testWithLog('recupererActionsFavoris obtenir les actions favorites', async () => {
    axios.get.mockResolvedValue({ data: [] });
    await actionsApi.recupererActionsFavoris();
    expect(axios.get).toHaveBeenCalledWith('/actions/favoris');
  });

  testWithLog('ajouterActionFavori ajoute une action favorite', async () => {
    axios.post.mockResolvedValue({ data: {} });
    await actionsApi.ajouterActionFavori('AAPL');
    expect(axios.post).toHaveBeenCalledWith('/actions/favoris', { symbole: 'AAPL' });
  });

  testWithLog('supprimerActionFavori supprime une action favorite', async () => {
    axios.delete.mockResolvedValue({ data: {} });
    await actionsApi.supprimerActionFavori('AAPL');
    expect(axios.delete).toHaveBeenCalledWith('/actions/favoris', { data: { symbole: 'AAPL' } });
  });
});