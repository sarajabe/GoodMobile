import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('asserts invalid messages when the fields are filled with data that start with space for payment and billing fields', () => {
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
    it('Should enter covered address', () => {
        PageObjects.Coverage.enterAddressRefBothCoverages();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
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
    it('Should assert plan title to have 1GB', () => {
        cy.get('[data-cy="basePlan"]').should('have.text', '1GB 4G LTE ');
    });
    it('Should click on checkout btn', () => {
        PageObjects.ReviewCart.clickOnCheckoutBtn();
    });
    it('Should go to Payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('Should click on add another card', () => {
        PageObjects.Payment.clickOnAddAnotherCard();
    });
    it('Should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('Should assert the required validation messages for credit card details', () => {
        PageObjects.Payment.creditCardRequiredValidationMessages();
    });
    it('Should assert the required validation messages for billing address', () => {
        PageObjects.Payment.billingAddressRequiredValidationMessages();
    });
    it('Should enter invalid Credit Card Details', () => {
        PageObjects.Payment.fillInPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.INVALID_NAME.NAME_ON_CARD, CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CARD.PAN, CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CVV2.CVV);
        cy.get('select').eq(0).select('01', { force: true }).should('have.value', '01');
        cy.get('select').eq(1).select('22', { force: true }).should('have.value', '22');
    });
    it('should fill in invalid billing address info', () => {
        PageObjects.ShippingPage.fillInShippingInfo(CONSTANT.SHIPPING.INVALID_ADDRESS.NAME,
            CONSTANT.SHIPPING.INVALID_ADDRESS.ADDRESS1,
            CONSTANT.SHIPPING.INVALID_ADDRESS.CITY,
            CONSTANT.SHIPPING.INVALID_ADDRESS.STATE,
            CONSTANT.SHIPPING.INVALID_ADDRESS.POSTAL);
        cy.get('[data-cy="addressName"]').click();
    });
    it('Should assert the invalid validation messages for credit card details', () => {
        PageObjects.Payment.creditCardInvalidValidationMessages();
    });
    it('Should assert the invalid validation messages', () => {
        PageObjects.Payment.billingAddressInvalidValidationMessages();
    });
    it('Should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('Should stay on Payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('Should assert the invalid validation messages for credit card details', () => {
        PageObjects.Payment.creditCardInvalidValidationMessages();
    });
    it('Should assert the invalid validation messages', () => {
        PageObjects.Payment.billingAddressInvalidValidationMessages();
    });
    it('Should enter invalid Credit Card Details', () => {
        PageObjects.Payment.fillInPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.CARD_START_WITH_SPACE.NAME_ON_CARD, CONSTANT.PAYMENT.CREDIT_CARD.VALID.PAN, CONSTANT.PAYMENT.CREDIT_CARD.VALID.CVV);
        cy.get('select').eq(0).select('10', { force: true }).should('have.value', '10');
        cy.get('select').eq(1).select('26', { force: true }).should('have.value', '26');
    });
    it('should fill in billing address info', () => {
        PageObjects.ShippingPage.fillInShippingInfo(CONSTANT.PAYMENT.BILLING_DATA.VALID.NAME,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.ADDRESS,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.CITY,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.STATE,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.POSTAL);
        cy.get('[data-cy="addressName"]').click();
    });
    it('Should assert the invalid validation messages for credit card details', () => {
        cy.get('.checkout-payment-form > :nth-child(2) > .ng-star-inserted').should('have.text', 'Invalid Name. ');
    });
    it('Should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('Should stay on Payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('Should assert the invalid validation messages for credit card details', () => {
        cy.get('.checkout-payment-form > :nth-child(2) > .ng-star-inserted').should('have.text', 'Invalid Name. ');
    });
    it('Should enter valid Credit Card Details', () => {
        PageObjects.Payment.fillInPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.VALID.NAME_ON_CARD, CONSTANT.PAYMENT.CREDIT_CARD.VALID.PAN, CONSTANT.PAYMENT.CREDIT_CARD.VALID.CVV);
        cy.get('select').eq(0).select('10', { force: true }).should('have.value', '10');
        cy.get('select').eq(1).select('26', { force: true }).should('have.value', '26');
    });
    it('should fill in invalid billing address info', () => {
        PageObjects.ShippingPage.fillInShippingInfo(CONSTANT.PAYMENT.BILLING_DATA.VALID.NAME,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.ADDRESS,
            CONSTANT.PAYMENT.BILLING_DATA.BILLING_START_WITH_SPACE.CITY,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.STATE,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.POSTAL);
        cy.get('[data-cy="addressName"]').click();
    });
    it('Should assert the invalid validation messages for credit card details', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
    });
    it('Should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('Should stay on Payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('Should assert the invalid validation messages for credit card details', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
    });
    it('Should enter valid Credit Card Details', () => {
        PageObjects.Payment.fillInPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.VALID.NAME_ON_CARD, CONSTANT.PAYMENT.CREDIT_CARD.VALID.PAN, CONSTANT.PAYMENT.CREDIT_CARD.VALID.CVV);
        cy.get('select').eq(0).select('10', { force: true }).should('have.value', '10');
        cy.get('select').eq(1).select('26', { force: true }).should('have.value', '26');
    });
    it('should fill in invalid billing address info', () => {
        PageObjects.ShippingPage.fillInShippingInfo(CONSTANT.PAYMENT.BILLING_DATA.VALID.NAME,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.ADDRESS,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.CITY,
            CONSTANT.PAYMENT.BILLING_DATA.BILLING_START_WITH_SPACE.STATE,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.POSTAL);
        cy.get('[data-cy="addressName"]').click();
    });
    it('Should assert the invalid validation messages for credit card details', () => {
        cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
    });
    it('Should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('Should stay on Payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('Should assert the invalid validation messages for credit card details', () => {
        cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
    });
    it('Should enter valid Credit Card Details', () => {
        PageObjects.Payment.fillInPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.VALID.NAME_ON_CARD, CONSTANT.PAYMENT.CREDIT_CARD.VALID.PAN, CONSTANT.PAYMENT.CREDIT_CARD.VALID.CVV);
        cy.get('select').eq(0).select('10', { force: true }).should('have.value', '10');
        cy.get('select').eq(1).select('26', { force: true }).should('have.value', '26');
    });
    it('should fill in invalid billing address info', () => {
        PageObjects.ShippingPage.fillInShippingInfo(CONSTANT.PAYMENT.BILLING_DATA.VALID.NAME,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.ADDRESS,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.CITY,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.STATE,
            CONSTANT.PAYMENT.BILLING_DATA.BILLING_START_WITH_SPACE.POSTAL);
        cy.get('[data-cy="addressName"]').click();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
    });
    it('Should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('Should stay on Payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
    });
});