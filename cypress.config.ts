import { defineConfig } from 'cypress'

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
    baseUrl: 'http://localhost:4000/home',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
