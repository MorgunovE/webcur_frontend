const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        logResult({ message }) {
          const logDir = path.resolve(__dirname, "tests/logs");
          const logPath = path.join(logDir, "e2e-results.log");
          if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
          }
          const now = new Date().toISOString();
          fs.appendFileSync(logPath, `[${now}] ${message}\n`);
          return null;
        },
      });
    },
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:8080",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    env: {
      VUE_APP_API_URL: process.env.VUE_APP_API_URL || "http://localhost:5000",
      VUE_APP_API_URL_REMOTE: process.env.VUE_APP_API_URL_REMOTE || "",
    },
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "webpack",
    },
  },
});
