function logResult(message) {
  cy.task('logResult', { message });
}

describe('Compte - E2E', () => {
  const testUser = {
    email: `cypresscompte${Date.now()}@mail.com`,
    mot_de_passe: 'cypresscompteuser',
    nom_utilisateur: `CypressCompteUser${Date.now()}`
  };
  let userId = null;
  let apiBaseUrl = '';
  let token = null;

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
    detectApiBaseUrl().then(() => {
      cy.request({
        method: 'POST',
        url: `${apiBaseUrl}/utilisateurs`,
        body: testUser,
        failOnStatusCode: false
      }).then((response) => {
        userId = response.body.id || response.body.data?.id;
        return cy.request({
          method: 'POST',
          url: `${apiBaseUrl}/connexion`,
          body: { email: testUser.email, mot_de_passe: testUser.mot_de_passe },
          failOnStatusCode: false
        }).then(loginRes => {
          token = loginRes.body.access_token || loginRes.body.token;
        });
      });
    });
  });

  let currentTestName = '';

  beforeEach(function () {
    currentTestName = this.currentTest.title;
  });

  afterEach(function () {
    const status = this.currentTest.state === 'passed' ? 'RÉUSSI' : 'ÉCHEC';
    const errMsg = this.currentTest.err ? ` - ${this.currentTest.err.message}` : '';
    logResult(`${currentTestName} - ${status}${errMsg}`);
  });

  after(() => {
    if (userId && token) {
      cy.request({
        method: 'DELETE',
        url: `${apiBaseUrl}/utilisateurs/${userId}`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false
      });
    }
  });

  it('Affiche le hero avec le nom de l\'utilisateur après connexion', () => {
    cy.visit('/login');
    cy.get('[data-cy="login-email"]').type(testUser.email);
    cy.get('[data-cy="login-password"]').type(testUser.mot_de_passe);
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/account');
    cy.get('[data-cy="compte-hero-title"]')
      .should('contain', `Bienvenue à nouveau, ${testUser.nom_utilisateur} !`);
    cy.contains('Votre parcours financier continue');
  });

  it('Affiche le nom d\'utilisateur et l\'email dans la carte du compte', () => {
    cy.visit('/login');
    cy.get('[data-cy="login-email"]').type(testUser.email);
    cy.get('[data-cy="login-password"]').type(testUser.mot_de_passe);
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/account');
    cy.get('[data-cy="compte-username"]').should('contain', testUser.nom_utilisateur);
    cy.get('[data-cy="compte-email"]').should('contain', testUser.email);
  });

  it('Met à jour le nom d\'utilisateur', () => {
    cy.visit('/login');
    cy.get('[data-cy="login-email"]').type(testUser.email);
    cy.get('[data-cy="login-password"]').type(testUser.mot_de_passe);
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/account');
    const nouveauNom = `${testUser.nom_utilisateur}_modifié`;
    cy.get('[data-cy="compte-nouveau-nom"] input').clear();
    cy.get('[data-cy="compte-nouveau-nom"] input').should('have.value', '');
    cy.get('[data-cy="compte-nouveau-nom"] input').type(nouveauNom);
    cy.get('[data-cy="compte-update-btn"]').click();
    cy.get('[data-cy="compte-username"]').should('contain', nouveauNom);
  });

  it('Ajoute et supprime une devise favorite', () => {
    cy.visit('/login');
    cy.get('[data-cy="login-email"]').type(testUser.email);
    cy.get('[data-cy="login-password"]').type(testUser.mot_de_passe);
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/account');

    // Ajouter une devise favorite
    cy.get('[data-cy="autocomplete-devise-favori"]').type('CAD');
    cy.get('.v-autocomplete__content').contains('CAD').click();
    cy.get('[data-cy="ajouter-devise-favori"]', { timeout: 10000 }).click();
    cy.contains('.font-weight-bold', 'CAD', { timeout: 10000 }).should('exist');

    // Supprimer la devise favorite
    cy.contains('.font-weight-bold', 'CAD')
      .parents('.v-card')
      .find('[data-cy="supprimer-devise-favori"]')
      .click();
    cy.contains('.font-weight-bold', 'CAD').should('not.exist');
  });

  it('Ajoute et supprime une action favorite', () => {
    cy.visit('/login');
    cy.get('[data-cy="login-email"]').type(testUser.email);
    cy.get('[data-cy="login-password"]').type(testUser.mot_de_passe);
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/account');

    // Ajouter une action favorite
    cy.get('[data-cy="autocomplete-action-favori"]').type('AAPL');
    cy.get('.v-autocomplete__content').contains('AAPL').click();
    cy.get('[data-cy="ajouter-action-favori"]').should('not.be.disabled').click();

    // Vérifier que l'action favorite a été ajoutée
    cy.get('[data-cy="supprimer-action-favori"]', { timeout: 10000 })
      .parents('.v-card')
      .contains('.font-weight-bold', 'AAPL')
      .should('exist');

    // Supprimer l'action favorite
    cy.get('[data-cy="supprimer-action-favori"]')
      .parents('.v-card')
      .contains('.font-weight-bold', 'AAPL')
      .parents('.v-card')
      .find('[data-cy="supprimer-action-favori"]')
      .click();

    // Vérifier que l'action favorite n'est plus dans la liste
    cy.get('[data-cy="action-favori-card"]', { timeout: 10000 })
        .should('not.exist');
  });

  it('Affiche et interagit avec la carte des détails de devise', () => {
    // Connexion
    cy.visit('/login');
    cy.get('[data-cy="login-email"]').type(testUser.email);
    cy.get('[data-cy="login-password"]').type(testUser.mot_de_passe);
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/account');

    // Cible l'input réel de l'autocomplete
    cy.get('[data-cy="devise-autocomplete"] input')
        .clear();

    cy.get('[data-cy="devise-autocomplete"] input')
        .type('CAD');

    // Sélectionne dans la liste
    cy.get('.v-autocomplete__content', { timeout: 10000 })
        .contains('CAD')
        .click();

    // Vérifie l'affichage des détails de la devise sélectionnée
    cy.get('[data-cy="devise-card-title"]', { timeout: 10000 }).should('contain', 'CAD');
    cy.get('[data-cy="devise-taux"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy="devise-date"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy="devise-base"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy="devise-conversion-rates"]', { timeout: 10000 }).should('be.visible');

    // Vérifie le bouton "Show all" et "Show less"
    cy.get('[data-cy="devise-show-all-btn"]', { timeout: 10000 }).click();
    cy.get('[data-cy="devise-show-less-btn"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy="devise-show-less-btn"]', { timeout: 10000 }).click();

    // Vérifie le bouton PDF (si la devise est active)
    cy.get('[data-cy="devise-pdf-btn"]', { timeout: 10000 }).should('be.visible');
  });

  it('Affiche la section Devises populaires après connexion', () => {
    cy.visit('/login');
    cy.get('[data-cy="login-email"]').type(testUser.email);
    cy.get('[data-cy="login-password"]').type(testUser.mot_de_passe);
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/account');
    cy.get('[data-cy="section-devises-populaires"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy="devise-populaire"]', { timeout: 20000 }).should('be.visible');
  });

  it('Convertit un montant entre deux devises', () => {
    cy.visit('/login');
    cy.get('[data-cy="login-email"]').type(testUser.email);
    cy.get('[data-cy="login-password"]').type(testUser.mot_de_passe);
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/account');

    // Remplir le formulaire de conversion
    cy.get('[data-cy="conversion-source"]', { timeout: 10000 }).click().get('.v-list-item').contains('USD').click();
    cy.get('[data-cy="conversion-cible"]', { timeout: 10000 }).click().get('.v-list-item').contains('EUR').click();
    cy.get('[data-cy="conversion-montant"] input').clear();
    cy.get('[data-cy="conversion-montant"] input').type('10');
    cy.get('[data-cy="conversion-submit"]').click();

    // Vérifier le résultat de la conversion
    cy.get('[data-cy="conversion-result"]', { timeout: 10000 })
      .should('contain', '10 USD')
      .and('contain', 'EUR');
  });

 it('Affiche les détails de l\'action sélectionnée et le bouton PDF', () => {
   // Connexion utilisateur
   cy.visit('/login');
   cy.get('[data-cy="login-email"]').type(testUser.email);
   cy.get('[data-cy="login-password"]').type(testUser.mot_de_passe);
   cy.get('[data-cy="login-submit"]').click();
   cy.url().should('include', '/account');

   // Attendre que l'autocomplete soit visible
   cy.get('[data-cy="action-details-autocomplete"]', { timeout: 20000 })
       .should('be.visible');
   cy.get('[data-cy="action-details-autocomplete"]', { timeout: 20000 })
       .click();
   cy.get('.v-autocomplete__content', { timeout: 20000 })
     .contains('AAPL')
     .click();

   // Vérifie le bloc ActionDetailsCard
   cy.get('[data-cy="action-details-container"]', { timeout: 20000 }).should('be.visible');
   cy.get('[data-cy="action-details-title"]').should('contain', "Informations sur l'action");
   cy.get('[data-cy="action-details-autocomplete"]').should('be.visible');
   cy.get('[data-cy="action-details-info-card"]', { timeout: 20000 }).should('be.visible');
   cy.get('[data-cy="action-details-info-title"]').should('not.be.empty');
   cy.get('[data-cy="action-details-info-text"]').should('contain', 'Date:');
   cy.get('[data-cy="action-details-pdf-btn"]').should('be.visible');
   cy.get('[data-cy="action-details-chart"]', { timeout: 20000 }).should('exist');
 });

 it('Affiche le bloc Actions populaires et les cartes d\'actions', () => {
   cy.visit('/login');
   cy.get('[data-cy="login-email"]').type(testUser.email);
   cy.get('[data-cy="login-password"]').type(testUser.mot_de_passe);
   cy.get('[data-cy="login-submit"]').click();
   cy.url().should('include', '/account');

   // Vérifie la présence du bloc Actions populaires
   cy.get('[data-cy="section-actions-populaires"]', { timeout: 20000 }).should('be.visible');
   // Vérifie qu'il y a au moins une carte d'action populaire
   cy.get('[data-cy="action-populaire-card"]', { timeout: 20000 }).should('be.visible');

 });

 it('Calcule le coût d\'achat d\'une action', () => {
   cy.visit('/login');
   cy.get('[data-cy="login-email"]').type(testUser.email);
   cy.get('[data-cy="login-password"]').type(testUser.mot_de_passe);
   cy.get('[data-cy="login-submit"]').click();
   cy.url().should('include', '/account');

   // Remplir le formulaire d'achat d'action
   cy.get('[data-cy="achat-symbole"]', { timeout: 10000 }).click();
   cy.get('.v-list-item', { timeout: 10000 }).contains('AAPL').click();
   cy.get('[data-cy="achat-date"] input', { timeout: 10000 }).clear().type('2025-06-19');
   cy.get('[data-cy="achat-quantite"] input', { timeout: 10000 }).clear().type('2');
   cy.get('[data-cy="achat-devise"]', { timeout: 10000 }).click();
   cy.get('.v-list-item', { timeout: 10000 }).contains('EUR').click();

   cy.get('[data-cy="achat-calculer-btn"]').click();

   // Vérifier le résultat
   cy.get('[data-cy="achat-resultat"]', { timeout: 10000 })
     .should('contain', '2 AAPL')
     .and('contain', 'EUR')
     .and('contain', 'Taux');
 });

 it('Affiche et interagit avec la carte des détails entreprise', () => {
   // Connexion utilisateur
   cy.visit('/login');
   cy.get('[data-cy="login-email"]').type(testUser.email);
   cy.get('[data-cy="login-password"]').type(testUser.mot_de_passe);
   cy.get('[data-cy="login-submit"]').click();
   cy.url().should('include', '/account');

   // Attendre que le composant soit visible
   cy.get('[data-cy="entreprise-details-container"]', { timeout: 30000 }).should('be.visible');
   cy.get('[data-cy="entreprise-details-autocomplete"]', { timeout: 30000 }).should('be.visible');
   cy.get('[data-cy="entreprise-details-autocomplete"]', { timeout: 30000 }).click();

   // Sélectionner une entreprise (ex: AAPL)
   cy.get('.v-autocomplete__content', { timeout: 30000 }).contains('AAPL').click();

   // Vérifier l'affichage des infos
   cy.get('[data-cy="entreprise-details-info-card"]', { timeout: 30000 }).should('be.visible');
   cy.get('[data-cy="entreprise-details-info-title"]').should('contain', 'AAPL');
   cy.get('[data-cy="entreprise-details-info-text"]').should('contain', 'Prix:');
   cy.get('[data-cy="entreprise-details-info-text"]').should('contain', 'Variation:');
   cy.get('[data-cy="entreprise-details-info-text"]').should('contain', 'Capitalisation:');
   cy.get('[data-cy="entreprise-details-info-text"]').should('contain', 'CEO:');
   cy.get('[data-cy="entreprise-details-info-text"]').should('contain', 'Pays:');
   cy.get('[data-cy="entreprise-details-info-text"]').should('contain', 'Site web:');
   cy.get('[data-cy="entreprise-details-info-text"]').should('contain', 'Description:');

   // Vérifier le bouton PDF
   cy.get('[data-cy="entreprise-details-pdf-btn"]', { timeout: 30000 }).should('be.visible');

   // Vérifier le graphique
   cy.get('[data-cy="entreprise-details-chart"]', { timeout: 30000 }).should('exist');
 });

 it('Affiche le bloc Entreprises populaires et les cartes d\'entreprises', () => {
   cy.visit('/login');
   cy.get('[data-cy="login-email"]').type(testUser.email);
   cy.get('[data-cy="login-password"]').type(testUser.mot_de_passe);
   cy.get('[data-cy="login-submit"]').click();
   cy.url().should('include', '/account');

   // Vérifie la présence du bloc Entreprises populaires
   cy.get('[data-cy="section-entreprises-populaires"]', { timeout: 20000 }).should('be.visible');
   // Vérifie qu'il y a au moins une carte d'entreprise populaire
   cy.get('[data-cy="entreprise-populaire-card"]', { timeout: 20000 }).should('be.visible');
 });

  it('Déconnexion', () => {
    cy.visit('/login');
    cy.get('[data-cy="login-email"]').type(testUser.email);
    cy.get('[data-cy="login-password"]').type(testUser.mot_de_passe);
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/account');
    cy.contains('Se déconnecter').click();
    cy.url().should('not.include', '/account');
    cy.get('[data-cy="login-email"]').should('not.exist');
  });

  it('Supprime le compte utilisateur', () => {
    cy.visit('/login');
    cy.get('[data-cy="login-email"]').type(testUser.email);
    cy.get('[data-cy="login-password"]').type(testUser.mot_de_passe);
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/account');
    cy.get('[data-cy="compte-delete-btn"]').click();
    cy.url().should('not.include', '/account');
    cy.get('[data-cy="login-email"]').should('not.exist');
  });

});