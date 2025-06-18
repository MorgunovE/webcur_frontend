const fs = require('fs');
const path = require('path');
import axios from '@/api/axios';
import * as devisesApi from '@/api/devises';

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

describe('devises API', () => {
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

  testWithLog('recupererDevisesPopulaires pour lister les devises populaires', async () => {
    axios.get.mockResolvedValue({ data: [] });
    await devisesApi.recupererDevisesPopulaires();
    expect(axios.get).toHaveBeenCalledWith('/devises/populaires');
  });

  testWithLog('recupererDevise pour récupérer une devise spécifique', async () => {
    axios.get.mockResolvedValue({ data: {} });
    await devisesApi.recupererDevise('EUR');
    expect(axios.get).toHaveBeenCalledWith('/devises/EUR');
  });

  testWithLog('recupererHistoriqueDevise pour récupérer l\'historique d\'une devise', async () => {
    axios.get.mockResolvedValue({ data: [] });
    await devisesApi.recupererHistoriqueDevise('USD', 10);
    expect(axios.get).toHaveBeenCalledWith('/devises/USD/historique?jours=10');
  });

  testWithLog('recupererDevisesFavoris pour récupérer les devises favorites', async () => {
    axios.get.mockResolvedValue({ data: {} });
    await devisesApi.recupererDevisesFavoris();
    expect(axios.get).toHaveBeenCalledWith('/devises/favoris');
  });

  testWithLog('convertirDevise pour convertir une devise', async () => {
    const payload = { code_source: 'USD', code_cible: 'EUR', montant: 100 };
    axios.post.mockResolvedValue({ data: {} });
    await devisesApi.convertirDevise(payload);
    expect(axios.post).toHaveBeenCalledWith('/devises/conversion', payload);
  });

  testWithLog('ajouterDeviseFavori pour ajouter une devise favorite', async () => {
    axios.post.mockResolvedValue({ data: {} });
    await devisesApi.ajouterDeviseFavori('EUR');
    expect(axios.post).toHaveBeenCalledWith('/devises/favoris', { nom_devise: 'EUR' });
  });

  testWithLog('supprimerDeviseFavori pour supprimer une devise favorite', async () => {
    axios.delete.mockResolvedValue({ data: {} });
    await devisesApi.supprimerDeviseFavori('USD');
    expect(axios.delete).toHaveBeenCalledWith('/devises/favoris', { data: { nom_devise: 'USD' } });
  });
});