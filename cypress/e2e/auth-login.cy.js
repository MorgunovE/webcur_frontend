function logResult(message) {
    cy.task('logResult', { message });
}

describe('Authentification - E2E', () => {
    const testUser = {
        email: `cypressauthtestuser${Date.now()}@mail.com`,
        mot_de_passe: 'cypressauthtestuser',
        nom_utilisateur: `CypressAuthTestUser${Date.now()}`
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

    it('Connexion avec identifiants valides', () => {
        cy.visit('/login');
        cy.get('[data-cy="login-email"]').type(testUser.email);
        cy.get('[data-cy="login-password"]').type(testUser.mot_de_passe);
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
        cy.get('[data-cy="login-email"]').type(testUser.email);
        cy.get('[data-cy="login-password"]').type(testUser.mot_de_passe);
        cy.get('[data-cy="login-submit"]').click();
        cy.url().should('include', '/account');
        cy.contains('Se déconnecter').click();
        cy.url().should('not.include', '/account');
        cy.get('[data-cy="login-email"]').should('not.exist');
    });
});