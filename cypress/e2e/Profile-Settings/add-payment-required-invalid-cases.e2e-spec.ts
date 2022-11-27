import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to profile settings then add new payment required/invalid cases', () => {
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
    it('Should click on add another payment method', () => {
        PageObjects.ProfileSettings.clickOnAddAnotherPayment();
    });
    it('Should leave fields empty and click on save button', () => {
        PageObjects.ProfileSettings.clickOnSaveNewPayment();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should assert the required validation messages', () => {
        PageObjects.ProfileSettings.addPaymentAssertRequiredValidationMessages();
    });
    it('Should enter invalid credit card and billing address', () => {
        PageObjects.BillingPage.addPaymentInfoProcess(
            CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CARD.PAN,
            CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CARD.NAME_ON_CARD,
            CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CARD.CVV);
        cy.get('select').eq(0).select('12', { force: true }).should('have.value', '12');
        cy.get('select').eq(1).select('25', { force: true }).should('have.value', '25');
        PageObjects.BillingPage.addBillingInfo1(CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.NAME,
            CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.ADDRESS,
            CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.SUITE_NO);
        PageObjects.BillingPage.addBillingInfo2(CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.CITY,
            CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.STATE,
            CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.POSTAL);
        cy.get('[data-cy="fullName"]').click();
    });
    it('Should assert the invalid validation messages', () => {
        PageObjects.ProfileSettings.addPaymentAssertInvalidValidationMessages();
    });
    it('Should click on save button', () => {
        PageObjects.ProfileSettings.clickOnSaveNewPayment();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should assert the invalid validation messages', () => {
        PageObjects.ProfileSettings.addPaymentAssertInvalidValidationMessages();
    });
});