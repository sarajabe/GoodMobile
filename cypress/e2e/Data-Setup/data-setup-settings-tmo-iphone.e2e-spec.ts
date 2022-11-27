import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

// data setup tmo for iPhone from data settings

describe('Data setup tmo for iPhone from data settings', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should click on sign in', () => {
        PageObjects.HomePage.clickOnSignIn();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it('Should fill login info with valid data', () => {
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.MIRNA_YAHOO.EMAIL, CONSTANT.ACCESS.MIRNA_YAHOO.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on data settings link ', () => {
        PageObjects.AccountSummary.clickOnDataSettings();
    });
    it('Should go to Data Setup page for tmo', () => {
        PageObjects.TitleExpectations.goToDataSetupIphone();
    });
    it('The url should include network=tmo;os=ios', () => {
        cy.url().should('eq',`${CONSTANT.URLS.DOMAIN}/support/data-setup/tmo/ios`);
    });

});
