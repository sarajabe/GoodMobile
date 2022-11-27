import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

/* ********************************* */
/* Sign into account have numbers , then go account summary , and change the plan on expiry */
/* ********************************* */

describe('Sign in then go to account summary to change the plan on expiry', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_L_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_L_ACCOUNT.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page after signing in', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on change plan', () => {
        PageObjects.AccountSummary.clickOnChangePlan();
    });
    it('Should go to change plan page', () => {
        PageObjects.TitleExpectations.goToChangePlanPage();
    });
    it('Should select a replacement plan', () => {
        PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
    });
    it('Should select i want to change plan on expiry button', () => {
        PageObjects.AccountSummary.clickOnChangePlanOnExpiry();
    });
    it('Should click on proceed to checkout button', () => {
        PageObjects.AccountSummary.clickOnProceedToCheckout();
    });
    it('Should go to Payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('should ensure that Changing plan for: (512) 203-4783 is exist in payment page ', () => {
        cy.get('.mdn').should('have.text', 'Changing plan for: (512) 554-6283 ');
    });
    it('should select payment method successfully ', () => {
        PageObjects.BillingPage.selectPaymentMethod();
    });
    it('Should click on continue button', () => {
        PageObjects.BillingPage.clickOnContinueBilling();
    });
    it('Should go to place order page', () => {
        PageObjects.TitleExpectations.goToPlaceYourOrderPage();
    });
    it('Should check Place your order button to be enabled', () => {
        cy.get('[data-cy="place-your-order-button"]').should('not.be.disabled');
    });
    it('Should click on remove to remove the plan', () => {
        PageObjects.ShippingPage.clickOnRemoveOrder();
    });
    it('Should click on yes btn from the pop up', () => {
        PageObjects.ShippingPage.clickOnYesBtn();
    });
});
