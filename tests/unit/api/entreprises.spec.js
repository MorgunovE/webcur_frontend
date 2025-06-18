const fs = require('fs');
const path = require('path');
import axios from '@/api/axios';
import * as entreprisesApi from '@/api/entreprises';

jest.mock('@/api/axios');

const logDir = path.resolve(__dirname, '../../logs');
const logPath = path.join(logDir, 'unit-test-results.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function logResult(message) {
  const now = new Date().toISOString();
  fs.appendFileSync(logPath, `[${now}] ${message}\n`);
}

describe('API entreprises', () => {
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

  testWithLog('recupererEntreprisesPopulaires pour lister les entreprises populaires', async () => {
    axios.get.mockResolvedValue({ data: [] });
    await entreprisesApi.recupererEntreprisesPopulaires();
    expect(axios.get).toHaveBeenCalledWith('/societes/populaires');
  });

  testWithLog('recupererEntreprise pour récupérer une entreprise spécifique', async () => {
    axios.get.mockResolvedValue({ data: {} });
    await entreprisesApi.recupererEntreprise('AAPL');
    expect(axios.get).toHaveBeenCalledWith('/societes/AAPL');
  });

  testWithLog('recupererHistoriqueEntreprise pour récupérer l\'historique d\'une entreprise', async () => {
    axios.get.mockResolvedValue({ data: [] });
    await entreprisesApi.recupererHistoriqueEntreprise('AAPL', 10);
    expect(axios.get).toHaveBeenCalledWith('/societes/AAPL/historique?jours=10');
  });

});