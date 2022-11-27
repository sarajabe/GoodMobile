import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'


describe('Select plan as new customer  invalid/required cases', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.TEST_USER.EMAIL, CONSTANT.ACCESS.TEST_USER.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
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
    it('Should select plan', () => {
        PageObjects.Plans.clickOnPlan_1_GB();
    });
    it('Should click on i already have a phone', () => {
        PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
    });
    it('Should enter covered address on both ATT & TMO', () => {
        PageObjects.Coverage.enterAddressRefBothCoverages();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should click on check your phone btn', () => {
        PageObjects.Coverage.clickOnCheckCoverageBtn();
    });
    it('Should assert that the address is covered', () => {
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
    it('Should click on checkout btn', () => {
        PageObjects.ReviewCart.clickOnCheckoutBtn();
    });
    it('Should go to payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('Should fill in payment info invalid card number all 0’s', () => {
        PageObjects.Payment.fillInPaymentInfo(
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.NAME_ON_CARD,
            CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CARD_NUMBER.CARD_NUMBER,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.CVV);
        cy.get('select').eq(0).select('12', { force: true }).should('have.value', '12');
        cy.get('select').eq(1).select('25', { force: true }).should('have.value', '25');
    });
    it('Should fill in billing address', () => {
        PageObjects.PurchasedPlans.editShippingInfo(CONSTANT.SHIPPING.SHIPPING_DATA.NAME,
             CONSTANT.SHIPPING.SHIPPING_DATA.SHIPPING_ADDRESS,
             CONSTANT.SHIPPING.SHIPPING_DATA.SUITE_NO,
             CONSTANT.SHIPPING.SHIPPING_DATA.CITY,
             CONSTANT.SHIPPING.SHIPPING_DATA.STATE,
             CONSTANT.SHIPPING.SHIPPING_DATA.POSTAL);
    });
    it('Should assert invalid messages', () => {
        cy.get('.checkout-payment-form > :nth-child(3) > .ng-star-inserted').should('have.text','Invalid Credit Card Number. ');
    });
    it('Should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('Should assert invalid messages', () => {
        cy.get('.checkout-payment-form > :nth-child(3) > .ng-star-inserted').should('have.text','Invalid Credit Card Number. ');
    });
    it('Should stay on payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('Should fill in payment info with invalid card number', () => {
        PageObjects.Payment.fillInPaymentInfo(
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.NAME_ON_CARD,
            CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CARD.PAN,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.CVV);
        cy.get('select').eq(0).select('12', { force: true }).should('have.value', '12');
        cy.get('select').eq(1).select('25', { force: true }).should('have.value', '25');
    });
    it('Should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
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
    it('Should click on submit', () => {
        PageObjects.AccessControl.clickOnSubmitBtn();
    });
    it('Should assert that we could not submit the order because of entering invalid credit number and stay in palce order page', () => {
        PageObjects.TitleExpectations.goToPlaceYourOrderPage();
    });
    it('should delete the plan', () => {
        PageObjects.PlaceOrder.deletePlan();
    });
    it('should click on yes from the pop up', () => {
        PageObjects.PlaceOrder.clickOnYesFromThePopUp();
    });
    it('Should go to home page', () => {
        PageObjects.TitleExpectations.goToHomePage();
    });
});