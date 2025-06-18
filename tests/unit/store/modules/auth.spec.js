const fs = require('fs');
const path = require('path');
import * as utilisateurApi from '@/api/utilisateur';
import authModule from '@/store/modules/auth';

jest.mock('@/api/utilisateur');

const logDir = path.resolve(__dirname, '../../../logs');
const logPath = path.join(logDir, 'unit-test-results.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function logResult(message) {
  const now = new Date().toISOString();
  fs.appendFileSync(logPath, `[${now}] ${message}\n`);
}

describe('Module Vuex auth', () => {
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

  testWithLog('connexion doit appeler connecterUtilisateur et commit', async () => {
    const commit = jest.fn();
    const identifiants = { email: 'test@mail.com', mot_de_passe: '123456' };
    utilisateurApi.connecterUtilisateur.mockResolvedValue({
      data: { id: 1, nom_utilisateur: 'Test', access_token: 'tok' }
    });
    const result = await authModule.actions.connexion({ commit }, identifiants);
    expect(utilisateurApi.connecterUtilisateur).toHaveBeenCalledWith(identifiants);
    expect(commit).toHaveBeenCalledWith('setUtilisateur', {
      id: 1,
      nom_utilisateur: 'Test',
      email: 'test@mail.com'
    });
    expect(commit).toHaveBeenCalledWith('setToken', 'tok');
    expect(result).toBe(true);
  });

  testWithLog('connexion doit commit deconnexion en cas d\'erreur', async () => {
    const commit = jest.fn();
    utilisateurApi.connecterUtilisateur.mockRejectedValue(new Error('fail'));
    const result = await authModule.actions.connexion({ commit }, { email: 'fail', mot_de_passe: 'fail' });
    expect(commit).toHaveBeenCalledWith('deconnexion');
    expect(result).toBe(false);
  });

  testWithLog('deconnexion doit appeler commit pour setUtilisateur et setToken à null', async () => {
    const commit = jest.fn();
    await authModule.actions.deconnexion({ commit });
    expect(commit).toHaveBeenCalledWith('setToken', null);
    expect(commit).toHaveBeenCalledWith('setUtilisateur', null);
    expect(commit).toHaveBeenCalledWith('deconnexion');
  });

  testWithLog('reconnect doit vérifier le token et commit deconnexion si invalide', async () => {
    const commit = jest.fn();
    // Valid token
    const state = { token: 'tok' };
    const axios = require('@/api/axios').default;
    axios.get = jest.fn().mockResolvedValue({ data: {} });
    let result = await authModule.actions.reconnect({ commit, state });
    expect(result).toBe(true);

    // Invalid token
    axios.get = jest.fn().mockRejectedValue(new Error('unauthorized'));
    result = await authModule.actions.reconnect({ commit, state });
    expect(commit).toHaveBeenCalledWith('deconnexion');
    expect(result).toBe(false);
  });
});