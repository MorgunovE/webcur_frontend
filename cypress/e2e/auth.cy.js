const fs = require('fs');
const path = require('path');

const logDir = path.resolve(__dirname, '../../tests/logs');
const logPath = path.join(logDir, 'e2e-results.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function logResult(message) {
  const now = new Date().toISOString();
  fs.appendFileSync(logPath, `[${now}] ${message}\n`);
}

describe('Authentification - E2E', () => {
  function testWithLog(nom, fn) {
    it(nom, async () => {
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

  testWithLog('Connexion avec identifiants valides', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('test@mail.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
    cy.contains('Déconnexion');
  });

  testWithLog('Connexion avec identifiants invalides', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('fail@mail.com');
    cy.get('input[type="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();
    cy.contains('Identifiants invalides');
    cy.url().should('include', '/login');
  });

  testWithLog('Déconnexion', () => {
    // Supposons que l’utilisateur est déjà connecté
    cy.login('test@mail.com', '123456'); // custom command à créer si besoin
    cy.contains('Déconnexion').click();
    cy.url().should('include', '/login');
  });
});