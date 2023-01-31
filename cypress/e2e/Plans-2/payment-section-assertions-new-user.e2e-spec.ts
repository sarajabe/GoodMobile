import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Select plan as new user - add payment method assertions - required and invalid validation messages', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should click on shop menu ', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansGMPage();
    });
    it('Click on 6GB cart icon', () => {
        PageObjects.Plans.clickOnCartIcon();
    });
    it('Should go check compatibility page', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should enter the address reference', () => {
        PageObjects.Coverage.enterAddressRefBothCoverages();
    });
    it('Should click on check coverage btn', () => {
        PageObjects.Coverage.clickOnCheckCoverageBtn();
    });
    it(`Should stay in Check Your Phone's Compatibility page`, () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should assert that address is covered', () => {
        cy.get('.banner-content > .title').should('have.text', ' Great News!');
    });
    it('Should click on next btn', () => {
        PageObjects.Coverage.clickOnNextStepBtn();
    });
    it('Should click on skip for now link', () => {
        PageObjects.Compatibility.clickOnSkipForNowLink();
    });
    it('Should click on  yes skip  btn from the pop up ', () => {
        PageObjects.Compatibility.clickOnYesFromThePopUp();
    });
    it('Should go to review cart page', () => {
        PageObjects.TitleExpectations.goToReviewCartPage();
        cy.get('.head-title').should('have.text', 'Review your cart');
    });
    it('Should assert that sim type is SIM Card', () => {
        cy.get('[data-cy="simType-CartItems"]').should('have.text', 'SIM Card');
    });
    it('Should assert plan quantity', () => {
        cy.get('[data-cy="planQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('Should assert SIM quantity', () => {
        cy.get('[data-cy="simQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('Should click on checkout btn', () => {
        PageObjects.ReviewCart.clickOnCheckoutBtn();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it('Should click on sign up link', () => {
        PageObjects.AccessControl.clickOnSignUpLink();
    });
    it('Should go to the sign up page', () => {
        PageObjects.TitleExpectations.goToSignUpPage();
    });
    it('Should insert valid info for new customer', () => {
        PageObjects.AccessControl.signUp(CONSTANT.ACCESS.NEW_SIGNUP_DATA.FIRST_NAME,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA.LAST_NAME,
            PageObjects.Dynamics.makeNewEmail(),
            CONSTANT.ACCESS.NEW_SIGNUP_DATA.PASSWORD,
            CONSTANT.ACCESS.NEW_SIGNUP_DATA.CONFIRMED_PASS);
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should click on continue to  sign up ', () => {
        PageObjects.AccessControl.clickOnSubmitBtn();
    });
    it('Should go to shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('Click on home delivery', () => {
        PageObjects.ShippingPage.clickOnHomeDelivery();
    });
    it('Click on add shipping address', () => {
        PageObjects.ShippingPage.clickOnAddNewAddress();
    });
    it('Should enter valid city, state, and postal code address data start with space', () => {
        PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.SHIPPING_DATA.NAME,
            CONSTANT.SHIPPING.SHIPPING_DATA.SHIPPING_ADDRESS,
            CONSTANT.SHIPPING.SHIPPING_DATA.SUITE_NO,
            CONSTANT.SHIPPING.SHIPPING_DATA.CITY,
            CONSTANT.SHIPPING.SHIPPING_DATA.STATE,
            CONSTANT.SHIPPING.SHIPPING_DATA.POSTAL);
    });
    it('Should click on save btn', () => {
        PageObjects.ShippingPage.clickOnSaveBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should click on keep current address from pop up', () => {
        PageObjects.ShippingPage.chooseVerifiedAddress();
    });
    it('Should select shipping address', () => {
        cy.get('select').eq(0).select('USPS', { force: true }).should('have.value', 'usps');
        cy.get('select').eq(1).select('First Class Mail Shipping 3-7 Business days', { force: true }).should('have.value', 'usps_first_class_mail/letter');
    });
    it('should click on next', () => {
        PageObjects.ShippingPage.clickOnNextBtn();
    });
    it('Should go to payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('should leave fields empty and click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the required validation messages', () => {
        cy.get('[data-cy="requiredNameMsg"]').should('have.text','Name on card is required. ');
        cy.get('[data-cy="requiredCardNoMsg"]').should('have.text','Card number is required. ');
        cy.get('[data-cy="cvvRequiredMsg"]').should('have.text','CVV is required. ');
        cy.get('[data-cy="expiryMonthRequiredMsg"]').should('have.text',' Expiration month is required ');
        cy.get('[data-cy="expiryYearRequiredMsg"]').should('have.text',' Expiration year is required ');
    });
    it('should fill in invalid payment info', () => {
        PageObjects.Payment.fillInPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CARD.NAME_ON_CARD,
            CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CARD_NUMBER.CARD_NUMBER,
            CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CVV.CVV);
        cy.get('select').eq(0).select('03', { force: true }).should('have.value', '03');
        cy.get('select').eq(1).select('34', { force: true }).should('have.value', '34');
    });
    it('Should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidNameOnCardMsg"]').should('have.text','Invalid Name. ');
        cy.get('[data-cy="invalidCardNoMsg"]').should('have.text','Invalid Credit Card Number. ');
        cy.get('[data-cy="cvvInvalidMsg"]').should('have.text','CVV is invalid. ');
    });
    it('should fill in invalid name that start with space - valid card number and cvv', () => {
        PageObjects.Payment.fillInPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.CARD_START_WITH_SPACE.NAME_ON_CARD,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.PAN,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.CVV);
        cy.get('select').eq(0).select('03', { force: true }).should('have.value', '03');
        cy.get('select').eq(1).select('34', { force: true }).should('have.value', '34');
    });
    it('Should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidNameOnCardMsg"]').should('have.text','Invalid Name. ');
    });
    it('should enter valid payment info', () => {
        PageObjects.Payment.fillInPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.VALID.NAME_ON_CARD,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.PAN,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.CVV);
        cy.get('select').eq(0).select('03', { force: true }).should('have.value', '03');
        cy.get('select').eq(1).select('34', { force: true }).should('have.value', '34');
    });
    it('Should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should click on next', () => {
        PageObjects.Payment.clickOnNextBtn();
    });
    it('Should go to purchase successful page', () => {
        PageObjects.TitleExpectations.goToPlaceYourOrderPage();
    });
    it('Should assert that the credit card brand', () => {
        cy.get('[data-cy="cardBrand"]').should('have.text', 'Credit Card');
    });
    it('Should assert that the credit card ending number', () => {
        cy.get('.flex > .desc').should('have.text', 'Ending in 1111');
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
})