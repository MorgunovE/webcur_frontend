const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        logResult({ message }) {
          const logDir = path.resolve(__dirname, 'tests/logs');
          const logPath = path.join(logDir, 'e2e-results.log');
          if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
          }
          const now = new Date().toISOString();
          fs.appendFileSync(logPath, `[${now}] ${message}\n`);
          return null;
        },
      });
    },
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});