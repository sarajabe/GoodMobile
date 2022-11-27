import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'


describe('Sign in then go to account summary then go to order add ons to add an add-on', () => {
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
    it('Should go to account summary page after signing in', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on order add ons', () => {
        PageObjects.AccountSummary.clickOnOrderAddOns();
    });
    it('Should go to Plan addOns page', () => {
        PageObjects.TitleExpectations.goToPlanAddOnsPage();
    });
    it('Should select the amount of Data add-on required', () => {
        PageObjects.PlanAddOns.clickOnPlus();
    });
    it('Should click on Proceed to checkout button', () => {
        PageObjects.PlanAddOns.clickOnProceedCheckout();
    });
    it('Should go to Payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('should ensure that the Quantity: 1 ', () => {
        cy.get('.order-details-section > :nth-child(3) > .order-details > .plan-category-title > .quantity').should('have.text', 'Quantity: 1');
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
    it('Should go to purchase successful page', () => {
        PageObjects.TitleExpectations.goToPurchaseSuccessfulPage();
    });
    it('Should click on Go to summary button', () => {
        PageObjects.AccountSummary.clickOnGoAccountToSummaryBtn();
    });
    it('Should go to account summary page after clicking on go to account summary', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });

});
