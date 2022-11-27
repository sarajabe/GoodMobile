import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'
/* ********************************* */
/* Sign into account have numbers , then go account summary , and change the plan */
/* ********************************* */

describe('Sign in then go to account summary to change the plan', () => {
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
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on change plan', () => {
        PageObjects.AccountSummary.clickOnChangePlanLink();
    });
    it('Should go to change plan page', () => {
        PageObjects.TitleExpectations.goToChangePlanPage();
    });
    it('Should select a replacement plan', () => {
        PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
    });
    it('Should select i want to change plan now button', () => {
        PageObjects.AccountSummary.clickOnChangePlanNow();
    });
    it('Should click on proceed to checkout button', () => {
        PageObjects.AccountSummary.clickOnProceedToCheckout();
    });
    it('Should go to Payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('should ensure that Changing plan for: (512) 217-0437 is exist in payment page ', () => {
        cy.get('.mdn').should('have.text', 'Changing plan for: (512) 203-4783 ');
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
    it('Should click on Place your order button', () => {
        PageObjects.AccountSummary.clickOnPlaceYourOrder();
    });
    it('Should go to Purchase Successful page', () => {
        PageObjects.TitleExpectations.goToPurchaseSuccessfulPage();
    });
    it('Should click on Go to summary button', () => {
        PageObjects.AccountSummary.clickOnGoToSummaryForChangePlan();
    });
    it('Should stay in the page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
});
