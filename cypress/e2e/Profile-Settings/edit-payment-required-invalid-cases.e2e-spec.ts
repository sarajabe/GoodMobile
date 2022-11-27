import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to profile settings then edit payment required/invalid cases', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.TEST1_USER.EMAIL, CONSTANT.ACCESS.TEST1_USER.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on Profile settings', () => {
        PageObjects.AccountSummary.clickOnProfileSetting();
    });
    it('Should go to Settings page', () => {
        PageObjects.TitleExpectations.goToProfileSettingsPage();
    });
    it('Should click on edit payment method icon', () => {
        PageObjects.ProfileSettings.clickOnEditPaymentIcon();
    });
    it('Should click on edit payment address', () => {
        PageObjects.ProfileSettings.clickOnEditPaymentAddress();
    });
    it('Should click on update payment button', () => {
        PageObjects.ProfileSettings.clickOnUpdatePaymentMethodButton();
    });
    it('Should assert the required cvv validation messages', () => {
        cy.get('[data-cy="cvvRequiredMsg"]').should('have.text', ' CVV is required. ');  
    });
    it('Should cleaar all fields', () => {
        cy.get('[data-cy="nameField"]').click({ force: true });
        cy.get('[data-cy="nameField"]').clear();
        cy.get('[data-cy="cardCodeField"]').click({ force: true });
        cy.get('[data-cy="cardCodeField"]').clear();
        cy.get('[data-cy="nameField"]').click({ force: true });
        cy.get('[data-cy="addressNameField"]').click();
        cy.get('[data-cy="addressNameField"]').clear();
        cy.get('[data-cy="addressLookup"]').click();
        cy.get('[data-cy="addressLookup"]').clear();
        cy.get('[data-cy="stateField"]').click();
        cy.get('[data-cy="stateField"]').clear();
        cy.get('[data-cy="cityField"]').click();
        cy.get('[data-cy="cityField"]').clear();
        cy.get('[data-cy="zipField"]').click();
        cy.get('[data-cy="zipField"]').clear();
        cy.get('[data-cy="addressNameField"]').click();
    });
    it('Should assert the required validation messages', () => {
        PageObjects.ProfileSettings.editPaymentAssertRequiredValidationMessages();
    });
    it('Should click on update payment button', () => {
        PageObjects.ProfileSettings.clickOnUpdatePaymentMethodButton();
    });
    it('Should assert the required validation messages', () => {
        PageObjects.ProfileSettings.editPaymentAssertRequiredValidationMessages();
    });
    it('Should say on edit payment method pop up and then close it ', () => {
        cy.get('.modal-heading').should('have.text', 'Edit payment method');
    });
    it('Should fill in invalid payment details', () => {
        PageObjects.BillingPage.editPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CARD.NAME_ON_CARD,
            CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CARD.CVV);
        cy.get('select').eq(0).select('12', { force: true }).should('have.value', '12');
        cy.get('select').eq(1).select('25', { force: true }).should('have.value', '25');
    });
    it('Should fill in invalid payment address details', () => {
        PageObjects.BillingPage.editPaymenAddresstInfo(CONSTANT.SHIPPING.INVALID_ADDRESS.NAME,
            CONSTANT.SHIPPING.INVALID_ADDRESS.ADDRESS1,
            CONSTANT.SHIPPING.INVALID_ADDRESS.STATE,
            CONSTANT.SHIPPING.INVALID_ADDRESS.CITY,
            CONSTANT.SHIPPING.INVALID_ADDRESS.POSTAL);
    });
    it('Should assert the invalid validtion messages', () => {
        PageObjects.ProfileSettings.editPaymentAssertInvalidValidationMessages();
    });
    it('Should click on update payment button', () => {
        PageObjects.ProfileSettings.clickOnUpdatePaymentMethodButton();
    });
    it('Should assert the invalid validtion messages', () => {
        PageObjects.ProfileSettings.editPaymentAssertInvalidValidationMessages();
    });
    it('Should say on edit payment method pop up and then close it ', () => {
        cy.get('.modal-heading').should('have.text', 'Edit payment method');
    });
    it('Should Should click on close icon for edit payment pop up ', () => {
        PageObjects.ProfileSettings.clickOnCloseIcon();
    });
});