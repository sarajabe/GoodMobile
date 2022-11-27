import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'
describe('Check coverage from header - TMO, ATT and both coverages - logged in', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_G_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_G_ACCOUNT.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should click on coverage from the header', () => {
        PageObjects.HomePage.clickOnCoverage();
    });
    it('Should leave address field empty and click on check coverage btn', () => {
        PageObjects.PurchasedPhones.clickOncheckCoverageBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should assert the required address validation message', () => {
        cy.get('[data-cy="selectAddressValidationMsg"]').should('have.text','Full Address is required');
    });
    it('Should enter an address that is not selected from the autofill list', () => {
        PageObjects.Coverage.addressRefNotSelectedFromList();
    });
    it('Should click on check coverage btn', () => {
        PageObjects.PurchasedPhones.clickOncheckCoverageBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should assert the validation message of address not selected from the autofill list', () => {
        cy.get('[data-cy="selectAddressValidationMsg"]').should('have.text','Please select address from the autocomplete list');
    });
    it('Should clear address Ref', () => {
        cy.get('[data-cy="addressRef"]').clear();
    });
    it('Should enter covered address - ATT', () => {
        PageObjects.Coverage.enterAddressRefATTCoverages();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on check coverage btn', () => {
        PageObjects.PurchasedPhones.clickOncheckCoverageBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should assert that the coverage result is ATT', () => {
        cy.get('[href="https://www.att.com"]').should('have.text','AT&T');
    });
    it('The url should include support/coverage;networkType=att;zipCode=76034', () => {
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/coverage;networkType=att;zipCode=76034`);
    });
    it('Should click on coverage from the header', () => {
        PageObjects.HomePage.clickOnCoverage();
    });
    it('Should assert that the coverage result is TMO', () => {
        PageObjects.Coverage.enterAddressRefTMOCoverages();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on check coverage btn', () => {
        PageObjects.PurchasedPhones.clickOncheckCoverageBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should assert the T-Mobile', () => {
       cy.get('[href="https://www.T-mobile.com"]').should('have.text','T-Mobile');
    });
    it('The url should include support/coverage;networkType=tmo;zipCode=75201', () => {
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/coverage;networkType=tmo;zipCode=75201`);
    });
    it('Should click on coverage from the header', () => {
        PageObjects.HomePage.clickOnCoverage();
    });
    it('Should enter covered address on both ATT & TMO', () => {
        PageObjects.Coverage.enterAddressRefBothCoverages();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on check coverage btn', () => {
        PageObjects.PurchasedPhones.clickOncheckCoverageBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should assert that the coverage result is TMO', () => {
        cy.get('[href="https://www.T-mobile.com"]').should('have.text','T-Mobile');
    });
    it('The url should include support/coverage;networkType=tmo;zipCode=10038', () => {
        cy.url().should('eq', `${CONSTANT.URLS.DOMAIN}/support/coverage;networkType=tmo;zipCode=10038`);
    });
})

    