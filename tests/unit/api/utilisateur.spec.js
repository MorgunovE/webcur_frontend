const fs = require('fs');
const path = require('path');
import axios from '@/api/axios';
import * as utilisateurApi from '@/api/utilisateur';

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

describe('utilisateur API', () => {
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

    testWithLog('recupererUtilisateur pour récupérer un utilisateur', async () => {
        axios.get.mockResolvedValue({ data: {} });
        await utilisateurApi.recupererUtilisateur(1);
        expect(axios.get).toHaveBeenCalledWith('/utilisateurs/1');
    });

    testWithLog('mettreAJourUtilisateur pour mettre à jour un utilisateur', async () => {
        const donnees = { nom_utilisateur: 'NouveauNom' };
        axios.put.mockResolvedValue({ data: {} });
        await utilisateurApi.mettreAJourUtilisateur(1, donnees);
        expect(axios.put).toHaveBeenCalledWith('/utilisateurs/1', donnees);
    });

    testWithLog('supprimerUtilisateur pour supprimer un utilisateur', async () => {
        axios.delete.mockResolvedValue({ data: {} });
        await utilisateurApi.supprimerUtilisateur(1);
        expect(axios.delete).toHaveBeenCalledWith('/utilisateurs/1');
    });

    testWithLog('creerUtilisateur pour créer un utilisateur', async () => {
        const donnees = { email: 'testmockfrontend@mail.com', mot_de_passe: '123456' };
        axios.post.mockResolvedValue({ data: {} });
        await utilisateurApi.inscrireUtilisateur(donnees);
        expect(axios.post).toHaveBeenCalledWith('/utilisateurs', donnees);
    });
});