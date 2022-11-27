import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants';

describe('Sign in then go to account summary to change-delete the plan', () => {
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
    it('Should click on shop menu', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should click on plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select the 1GB plan', () => {
        PageObjects.Plans.clickOnPlan_1_GB();
    });
    it('Should click on i already have a phone', () => {
        PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
    });
    it('Should enter covered address', () => {
        PageObjects.Coverage.enterAddressRefBothCoverages();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on check coverage btn', () => {
        PageObjects.Coverage.clickOnCheckCoverageBtn();
    });
    it('Should assert that address is covered', () => {
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
    });
    it('Should click on next btn', () => {
        PageObjects.Coverage.clickOnNextStepBtn();
    });
    it('Should go to check device step', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should click on skip for now link', () => {
        PageObjects.Compatibility.clickOnSkipForNowLink();
    });
    it('Should click on yes I am sure', () => {
        PageObjects.Compatibility.clickOnYesIamSureFromThePopUp();
    });
    it('Should go to review cart page', () => {
        PageObjects.TitleExpectations.goToPlansPage();
        cy.get('.head-title').should('have.text', 'Review your cart');
    });
    it('Should assert the SIM card type to be  eSIM', () => {
        cy.get('[data-cy="simType-CartItems"]').should('have.text', 'eSIM ');
    });
    it('Should click on checkout btn', () => {
        PageObjects.ReviewCart.clickOnCheckoutBtn();
    });
    it('Should go to payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('should select payment method', () => {
        PageObjects.Payment.selectFirstPaymentMethod();
    });
    it('should click on next', () => {
        PageObjects.Payment.clickOnNextBtn();
    });
    it('Should go to place order page', () => {
        PageObjects.TitleExpectations.goToPlaceYourOrderPage();
    });
    it('Should assert plan title to have 1GB', () => {
        cy.get('[data-cy="basePlan"]').first().should('have.text', '1GB 4G LTE ');
    });
    it('Should click on change plan', () => {
        PageObjects.PlaceOrder.clickOnChangePlan();
    });
    it('Should click on no btn in pop up window', () => {
        PageObjects.ReviewCart.clickOnNoBtn();
    });
    it('Should assert plan title to have 1GB', () => {
        cy.get('[data-cy="basePlan"]').should('have.text', '1GB 4G LTE ');
    });
    it('Should click on change plan', () => {
        PageObjects.PlaceOrder.clickOnChangePlan();
    });
    it('Should click on yes btn in pop up window', () => {
        PageObjects.PlaceOrder.clickOnYesFromThePopUp();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select the 10GB plan', () => {
        PageObjects.Plans.clickOn10GB_From_Plans_Page();
    });
    it('Should assert plan title to have 10GB', () => {
        cy.get('[data-cy="basePlan"]').should('have.text', '10GB 4G LTE ');
    });
    it('should delete the plan', () => {
        PageObjects.PlaceOrder.deletPlan();
    });
    it('should click on yes from the pop up', () => {
        PageObjects.PlaceOrder.clickOnYesFromThePopUp();
    });
    it('Should go to home page', () => {
        PageObjects.TitleExpectations.goToHomePage();
    });
});