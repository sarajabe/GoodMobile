import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

// check coverage tmo

describe('check coverage att', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.TEST15_USER.EMAIL, CONSTANT.ACCESS.TEST15_USER.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on coverage in header', () => {
        PageObjects.HomePage.clickOnCoverage();
    });
    it('Should go to Good2Go Coverage page', () => {
        PageObjects.TitleExpectations.goToGood2GoCoveragePage();
    });
    it('Should enter an ATT address reference', () => {
        PageObjects.Coverage.enterAddressRefATT();
    });
    it('Should handle the invisible recaptcha here', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on check coverage button', () => {
        PageObjects.Coverage.clickOnCheckCoverageButton();
    });
    it('Should go to Coverage page', () => {
        PageObjects.TitleExpectations.goToCoveragePage();
    });
    it('The url should include support/coverage;networkType=att;zipCode=33040', () => {
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/coverage;networkType=att;zipCode=33040`);
    });
});
