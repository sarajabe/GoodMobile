import { defineConfig } from 'cypress'
require('dotenv').config();

export default defineConfig({
  projectId: '96mumg',
  watchForFileChanges: true,
  defaultCommandTimeout: 10000,
  viewportWidth: 1490,
  viewportHeight: 2000,
  reporterOptions: {
    charts: true,
    overwrite: false,
    html: false,
    json: true,
    reportDir: 'cypress/reports/mocha',
  },
  chromeWebSecurity: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://gm-test.ztarmobile.io',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
  env: {
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    REACT_APP_GOOGLE_CLIENTID: process.env.REACT_APP_GOOGLE_CLIENTID,
    REACT_APP_GOOGLE_CLIENT_SECRET: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
  },
})
