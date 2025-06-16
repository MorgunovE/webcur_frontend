const fs = require('fs');
const path = require('path');
import router from '@/router';

const logDir = path.resolve(__dirname, '../../logs');
const logPath = path.join(logDir, 'test-results.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function logResult(message) {
  const now = new Date().toISOString();
  fs.appendFileSync(logPath, `[${now}] ${message}\n`);
}

describe('Configuration du routeur', () => {
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

  testWithLog('Le routeur doit être défini', async () => {
    expect(router).toBeDefined();
    expect(typeof router.push).toBe('function');
  });

  testWithLog('Les routes principales doivent exister', async () => {
    const routes = router.options.routes || router.getRoutes().map(r => r.path);
    expect(routes).toBeDefined();
    const hasHome = routes.some(r => r.path === '/' || r === '/');
    expect(hasHome).toBe(true);
  });

  testWithLog('La navigation vers une route connue fonctionne', async () => {
    await router.push('/');
    expect(router.currentRoute.value.path).toBe('/');
  });
});