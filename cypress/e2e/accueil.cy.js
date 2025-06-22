function logResult(message) {
  cy.task('logResult', { message });
}

describe('Accueil - E2E', () => {
  let currentTestName = '';
  let apiBaseUrl = '';

  function detectApiBaseUrl() {
    const local = Cypress.env('VUE_APP_API_URL') || 'http://localhost:5000';
    const remote = Cypress.env('VUE_APP_API_URL_REMOTE');
    const urls = [local, remote].filter(Boolean);

    return cy.then(() => {
      return Cypress.Promise.try(async () => {
        for (let i = 0; i < urls.length; i++) {
          try {
            const res = await fetch(`${urls[i]}/health`, { method: 'GET' });
            const body = await res.json().catch(() => ({}));
            if (
                res.status === 200 ||
                body.status === 'ok' ||
                body.status === 'OK'
            ) {
              apiBaseUrl = urls[i];
              return apiBaseUrl;
            }
          } catch (e) {
          }
        }
        throw new Error('No backend API available.');
      });
    });
  }

  before(() => {
    detectApiBaseUrl();
  });

  beforeEach(function () {
    currentTestName = this.currentTest.title;
    cy.visit('/');
  });

  afterEach(function () {
    const status = this.currentTest.state === 'passed' ? 'RÉUSSI' : 'ÉCHEC';
    const errMsg = this.currentTest.err ? ` - ${this.currentTest.err.message}` : '';
    logResult(`${currentTestName} - ${status}${errMsg}`);
  });

  it('Affiche le hero et le bouton "Commencer maintenant"', () => {
    cy.contains('Suivez, convertissez et comparez les devises en temps réel');
    cy.get('[data-cy="hero-register-btn"]').should('be.visible');
  });

  it('Affiche les trois fonctionnalités principales', () => {
    cy.contains('Conversion de devises');
    cy.contains('Données boursières');
    cy.contains('Favoris personnalisés');
  });

  it('Affiche la section Devises et les devises populaires', () => {
    cy.get('[data-cy="section-devises"]').should('be.visible');
    cy.get('[data-cy="devise-populaire"]', { timeout: 10000 }).should('have.length.at.least', 1);
  });

  it('Affiche la section Actions et les actions populaires', () => {
    cy.get('[data-cy="section-actions"]').should('be.visible');
    cy.get('[data-cy="action-populaire"]', { timeout: 10000 }).should('have.length.at.least', 1);
  });

  it('Affiche la section Entreprises et les entreprises populaires', () => {
    cy.get('[data-cy="section-entreprises"]').should('be.visible');
    cy.get('[data-cy="entreprise-populaire"]', { timeout: 10000 }).should('have.length.at.least', 1);
  });

  it('Redirige vers /register au clic sur "Commencer maintenant"', () => {
    cy.get('[data-cy="hero-register-btn"]').click();
    cy.url().should('include', '/register');
  });

  it('Redirige vers /currencies au clic sur une devise populaire', () => {
    cy.get('[data-cy="devise-populaire"]', { timeout: 10000 }).first().click();
    cy.url().should('include', '/currencies');
  });

  it('Redirige vers /stocks au clic sur une action populaire', () => {
    cy.get('[data-cy="action-populaire"]', { timeout: 10000 }).first().click();
    cy.url().should('include', '/stocks');
  });

  it('Redirige vers /companies au clic sur une entreprise populaire', () => {
    cy.get('[data-cy="entreprise-populaire"]', { timeout: 10000 }).first().click();
    cy.url().should('include', '/companies');
  });
});