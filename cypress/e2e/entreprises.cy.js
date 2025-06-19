function logResult(message) {
  cy.task('logResult', { message });
}

describe('Entreprises - E2E', () => {
  let currentTestName = '';

  beforeEach(function () {
    currentTestName = this.currentTest.title;
    cy.visit('/companies');
  });

  afterEach(function () {
    const status = this.currentTest.state === 'passed' ? 'RÉUSSI' : 'ÉCHEC';
    const errMsg = this.currentTest.err ? ` - ${this.currentTest.err.message}` : '';
    logResult(`${currentTestName} - ${status}${errMsg}`);
  });

  it('Affiche le hero et le bouton "Commencer maintenant"', () => {
    cy.contains('Découvrez les leaders du marché et suivez leurs performances en temps réel');
    cy.get('[data-cy="entreprise-hero-register-btn"]').should('be.visible');
  });

  it('Affiche les trois fonctionnalités principales', () => {
    cy.contains('Conversion de devises');
    cy.contains('Données boursières');
    cy.contains('Favoris personnalisés');
  });

  it('Affiche la section Entreprises', () => {
    cy.get('[data-cy="section-entreprises"]').should('be.visible');
  });

  it('Affiche les entreprises populaires', () => {
    cy.get('[data-cy="entreprise-populaire"]', { timeout: 10000 }).should('have.length.at.least', 1);
  });

  it('Redirige vers /register au clic sur "Commencer maintenant"', () => {
    cy.get('[data-cy="entreprise-hero-register-btn"]').click();
    cy.url().should('include', '/register');
  });

  it('Redirige vers /register au clic sur une entreprise populaire', () => {
    cy.get('[data-cy="entreprise-populaire"]', { timeout: 10000 }).first().click();
    cy.url().should('include', '/register');
  });

  it('Affiche la section Aperçu de l\'entreprise Apple (AAPL)', () => {
    cy.get('[data-cy="section-aapl"]', { timeout: 10000 }).should('be.visible');
    cy.contains('Aperçu de l\'entreprise Apple (AAPL)');
    cy.contains('Prix:');
    cy.contains('Variation:');
  });
});