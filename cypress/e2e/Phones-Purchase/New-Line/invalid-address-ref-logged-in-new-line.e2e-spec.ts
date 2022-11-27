import { PageObjects } from '../../../support/pageObjects'
import { CONSTANT } from '../../../fixtures/constants'

describe('Purchase a phone - new line - invalid address - logged in  ', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.EMPTY_ACCOUNT.EMAIL, CONSTANT.ACCESS.EMPTY_ACCOUNT.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPageWithNoMDNS();
    });
    it('Should click on shop menu ', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should click on phones', () => {
        PageObjects.HomePage.clickOnPhones();
    });
    it('Should go to phones page', () => {
        PageObjects.TitleExpectations.goToPhonesPage();
    });
    it('Should click on shop iphone', () => {
        PageObjects.PurchasedPhones.clickOnShopIphonePhones();
    });
    it('Should go to phones models page', () => {
        PageObjects.TitleExpectations.goToPhoneModelPage();
    });
    it('Should select 3rd phone', () => {
        PageObjects.PurchasedPhones.clickOnSelect3rdPhone();
    });
    it('Should go to phones phone details page', () => {
        PageObjects.TitleExpectations.goToPhoneDetailsPage();
    });
    it('Should select gray', () => {
        PageObjects.PurchasedPhones.clickOnXSGray();
    });
    it('Should select phone btn', () => {
        PageObjects.PurchasedPhones.clickOnSelecPhoneBtn();
    });
    it('Should sclick on add a new line', () => {
        PageObjects.PurchasedPhones.clickOnAddANewLine();
    });
    it('Should go to select line page', () => {
        PageObjects.TitleExpectations.goToSelectLinePage();
    });
    it('Should sclick on next', () => {
        PageObjects.PurchasedPhones.clickOnNextBtn();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select plan', () => {
        cy.get('#select-plan-GOOD2GO-20GB-50').click();
    });
    it('Should go to service coverage page', () => {

        PageObjects.TitleExpectations.goToServiceCoverageCheckPage();
    });
    it('Should leave the address ref empty', () => {
        cy.get('[data-cy="addressRef"]').click();
    });
    it('Should handle the invisible recaptcha', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should click on check coverage btn', () => {
        PageObjects.PurchasedPhones.clickOncheckCoverageBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should check the validatyion message', () => {
        cy.get('[data-cy="addressRequiredValidationMsg"]').should('have.text', 'Address is required');
    });
    it('Should reload the page', () => {
        cy.reload();
    });
    it('Should enter an invalid address reference', () => {
        PageObjects.Coverage.addressRefNotSelectedFromList();
    });
    it('Should handle the invisible recaptcha', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should click on check coverage btn', () => {
        PageObjects.PurchasedPhones.clickOncheckCoverageBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should check the validatyion message', () => {
        cy.get('[data-cy="selectAddressValidationMsg"]').should('have.text', 'Please select address from the autocomplete list');
    });
    it('Should check that the done btn is disabled', () => {
        cy.get('.right > .primary').should('be.disabled');

    });
});

