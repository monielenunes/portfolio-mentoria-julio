const { defineConfig } = require("cypress");
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data');
const dataFiles = ['users.json', 'employees.json', 'specialDates.json', 'gifts.json', 'shipments.json'];
const baselineDir = path.join(__dirname, 'cypress', 'fixtures', 'database');
const baselineData = Object.fromEntries(dataFiles.map((file) => [file, fs.readFileSync(path.join(baselineDir, file), 'utf8')]));

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/api/**/*.cy.js",
    setupNodeEvents(on, config) {
      on('task', {
        resetData() {
          for (const [file, contents] of Object.entries(baselineData)) {
            fs.writeFileSync(path.join(dataDir, file), contents);
          }
          return null;
        },
        createExpiredToken() {
          const jwt = require('jsonwebtoken');
          const secret = process.env.JWT_SECRET || 'mimorh-development-secret';
          return jwt.sign({ name: 'Administrador MimoRH', email: 'admin@mimorh.local', role: 'admin' }, secret, { subject: '1', expiresIn: -1 });
        },
      });
      return config;
    },
  },
});
