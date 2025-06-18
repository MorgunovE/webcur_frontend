function logResult(message) {
  cy.task('logResult', { message });
}

describe('Authentification - E2E', () => {
  let currentTestName = '';

  beforeEach(function () {
    currentTestName = this.currentTest.title;
  });

  afterEach(function () {
    const status = this.currentTest.state === 'passed' ? 'RÉUSSI' : 'ÉCHEC';
    const errMsg = this.currentTest.err ? ` - ${this.currentTest.err.message}` : '';
    logResult(`${currentTestName} - ${status}${errMsg}`);
  });

  it('Connexion avec identifiants valides', () => {
    cy.visit('/login');
    cy.get('[data-cy="login-email"]').type('cypresstestuser@mail.com');
    cy.get('[data-cy="login-password"]').type('cypresstestuser');
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/account');
    cy.contains('Se déconnecter');
  });

  it('Connexion avec identifiants invalides', () => {
    cy.visit('/login');
    cy.get('[data-cy="login-email"]').type('fail@mail.com');
    cy.get('[data-cy="login-password"]').type('wrongpass');
    cy.get('[data-cy="login-submit"]').click();
    cy.contains('Identifiants invalides');
    cy.url().should('include', '/login');
  });

  it('Déconnexion', () => {
    cy.visit('/login');
    cy.get('[data-cy="login-email"]').type('cypresstestuser@mail.com');
    cy.get('[data-cy="login-password"]').type('cypresstestuser');
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/account');
    cy.contains('Se déconnecter').click();
    cy.url().should('not.include', '/account');
    cy.get('[data-cy="login-email"]').should('not.exist');
  });
});