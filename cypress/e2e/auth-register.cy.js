function logResult(message) {
    cy.task('logResult', { message });
}

describe('Enregistrement - E2E', () => {
    const testUser = {
        email: `cypressregister${Date.now()}@mail.com`,
        mot_de_passe: 'cypressregisteruser',
        nom_utilisateur: `CypressRegisterUser${Date.now()}`
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

    let currentTestName = '';

    before(() => {
        detectApiBaseUrl();
    });

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

    it('Enregistrement avec des informations valides', () => {
        cy.visit('/register');
        cy.get('[data-cy="register-username"]').type(testUser.nom_utilisateur);
        cy.get('[data-cy="register-email"]').type(testUser.email);
        cy.get('[data-cy="register-password"]').type(testUser.mot_de_passe);
        cy.get('[data-cy="register-submit"]').click();
        cy.url().should('include', '/login');

        cy.get('[data-cy="login-email"]').type(testUser.email);
        cy.get('[data-cy="login-password"]').type(testUser.mot_de_passe);
        cy.get('[data-cy="login-submit"]').click();
        cy.url().should('include', '/account');
        cy.contains('Se déconnecter').click();
        cy.url().should('not.include', '/account');
        cy.get('[data-cy="login-email"]').should('not.exist');

        cy.request({
            method: 'POST',
            url: `${apiBaseUrl}/connexion`,
            body: { email: testUser.email, mot_de_passe: testUser.mot_de_passe },
            failOnStatusCode: false
        }).then(res => {
            userId = res.body.id || res.body.data?.id;
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

    it('Enregistrement avec un email déjà utilisé', () => {
        cy.visit('/register');
        cy.get('[data-cy="register-username"]').type('UserExistant');
        cy.get('[data-cy="register-email"]').type(testUser.email);
        cy.get('[data-cy="register-password"]').type('autremotdepasse');
        cy.get('[data-cy="register-submit"]').click();
        cy.get('[data-cy="register-error"]').should('contain', "Erreur lors de l'inscription");
        cy.url().should('include', '/register');
    });

    it('Validation du formulaire - champs obligatoires', () => {
        cy.visit('/register');
        cy.get('[data-cy="register-submit"]').click();
        cy.get('[data-cy="register-error"]').should('contain', "Erreur lors de l'inscription");
        cy.url().should('include', '/register');
    });
});