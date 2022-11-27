import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Select plan as existing - TMO - skip IMEI - eSim', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
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
    it(`Should go to Check Your Phone's Compatibility page`, () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should enter covered address - TMO', () => {
        PageObjects.Coverage.enterAddressRefTMOCoverages();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it('Should click on check coverage btn', () => {
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
    it('Should assert auto pay discount to be -$5', () => {
        cy.get('[data-cy="autoPayDiscount"]').should('have.text', '-$5/m');
    });
    it('Should assert plan quantity to equal 1', () => {
        cy.get('[data-cy="planQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('Should assert the SIM card type to be  eSIM', () => {
        cy.get('[data-cy="simType-CartItems"]').should('have.text', 'eSIM ');
    });
    it('Should assert eSIM quantity to equal 1', () => {
        cy.get('[data-cy="simQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('Should click on checkout btn', () => {
        PageObjects.ReviewCart.clickOnCheckoutBtn();
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
    it('Should assert that we don`t have shipping details', () => {
        cy.get('[data-cy="deliveryDetails"]').should('not.exist');
    });
    it('Should assert that the discount total equals to $5.00', () => {
        cy.get('[data-cy="discountValue"]').should('have.text', '$5.00');
    });
    it('Should assert that shipping fees equals to $0.00', () => {
        cy.get('[data-cy="shippingFees"]').should('have.text', '$0.00');
    });
    it('Should assert that the taxes fees are calculated correctly', () => {
        cy.get('[data-cy="taxesFees"]').should('have.text', '$2.14');
    });
    it('Should assert that sim type is eSIM', () => {
        cy.get('[data-cy="simType"]').should('have.text', 'eSIM ');
    });
    it('Should assert that the eSIM quantity equals to 1', () => {
        cy.get('[data-cy="simQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('Should click on submit btn', () => {
        PageObjects.PlaceOrder.clickOnSubmitBtn();
    });
    it('Should go to to purchase successful page', () => {
        PageObjects.TitleExpectations.goToPurchaseSuccessfulPage();
    });
    it('Should assert that the purchased sim is eSIM', () => {
        cy.get('.col-12 > :nth-child(4)').should('have.text', 'Your Plan & eSIM can be found in your Purchased Plans section. ')
    });
    it('Should click on Purchased Plans btn', () => {
        PageObjects.PurchaseSuccessful.clickOnPurchasedPlansBtn();
    });
    it('Should go to to purchased plans page', () => {
        PageObjects.TitleExpectations.goToPurchasedPlansPage();
    });
    it('Should assert that the activate btn has text of eSim activation', () => {
        cy.get('[data-cy="activatePlanBtn"]').should('have.text', 'Activate Plan & eSIM');
    });

});
