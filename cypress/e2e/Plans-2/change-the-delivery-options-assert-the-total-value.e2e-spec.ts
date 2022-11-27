import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Changes the delivery options and assert the total value according to selection', () => {
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
    it('Should select plan', () => {
        PageObjects.Plans.clickOnPlan_1_GB();
    });
    it('Should click on i already have a phone', () => {
        PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
    });
    it(`Should go to Check Your Phone's Compatibility page`, () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should enter covered address - ATT', () => {
        PageObjects.Coverage.enterAddressRefATTCoverages();
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
    it('Should click on send me physical sim', () => {
        PageObjects.Compatibility.clickOnSendMePhysicalSIM();
    });
    it('Should go to review cart page', () => {
        PageObjects.TitleExpectations.goToPlansPage();
        cy.get('.head-title').should('have.text', 'Review your cart');
    });
    it('Should click on checkout btn', () => {
        PageObjects.ReviewCart.clickOnCheckoutBtn();
    });
    it('Should go to shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('should select shipping address successfully ', () => {
        PageObjects.ShippingPage.selectShippingInfo();
    });
    it('should select shipping method', () => {
        cy.get('select').eq(1).select('Usps', { force: true }).should('have.value', 'usps');
        cy.get('select').eq(2).select('First Class Mail Shipping 3-7 Business days', { force: true }).should('have.value', 'usps_first_class_mail/letter');
    });
    it('should assert the price of delivery options is free', () => {
        cy.get('.price').should('have.text','Free');
    });
    it('should click on next', () => {
        PageObjects.ShippingPage.clickOnNextBtn();
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
    it('Should assert that shipping fees equals to $0.00', () => {
        cy.get('[data-cy="shippingFees"]').should('have.text', '$0.00');
    });
    it('Should assert that the shipping method is First Class Mail Shipping 3-7 Business days', () => {
        cy.get('[data-cy="shippingMethod"]').should('have.text', 'First Class Mail Shipping 3-7 Business days');
    });
    it('should click change address', () => {
        PageObjects.PlaceOrder.clickOnChangeShippingAddress();
    });
    it('Should go to shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('should change delivery options in shipping method', () => {
        cy.get('select').eq(2).select('Priority Mail 2-3 Business days with tracking provided by USPS.', { force: true }).should('have.value', 'usps_priority_mail/large_envelope_or_flat');
    });
    it('should assert the price of delivery options is $9.99', () => {
        cy.get('.price').should('have.text','$9.99');
    });
    it('should click on next', () => {
        PageObjects.ShippingPage.clickOnNextBtn();
    });
    it('Should go to place order page', () => {
        PageObjects.TitleExpectations.goToPlaceYourOrderPage();
    });
    it('Should assert that shipping fees equals to $9.99', () => {
        cy.get('[data-cy="shippingFees"]').should('have.text', '$9.99');
    });
    it('Should assert that the shipping method is Priority Mail 2-3 Business days with tracking provided by USPS.', () => {
        cy.get('[data-cy="shippingMethod"]').should('have.text', 'Priority Mail 2-3 Business days with tracking provided by USPS.');
    });
    it('should click change address', () => {
        PageObjects.PlaceOrder.clickOnChangeShippingAddress();
    });
    it('Should go to shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('should change delivery options in shipping method', () => {
        cy.get('select').eq(2).select('Priority Mail Express 1-2 Business days with tracking provided by USPS.', { force: true }).should('have.value', 'usps_priority_mail_express/large_envelope_or_flat');
    });
    it('should assert the price of delivery options is $19.99', () => {
        cy.get('.price').should('have.text','$19.99');
    });
    it('should click on next', () => {
        PageObjects.ShippingPage.clickOnNextBtn();
    });
    it('Should go to place order page', () => {
        PageObjects.TitleExpectations.goToPlaceYourOrderPage();
    });
    it('Should assert that shipping fees equals to $19.99', () => {
        cy.get('[data-cy="shippingFees"]').should('have.text', '$19.99');
    });
    it('Should assert that the shipping method is Priority Mail Express 1-2 Business days with tracking provided by USPS.', () => {
        cy.get('[data-cy="shippingMethod"]').should('have.text', 'Priority Mail Express 1-2 Business days with tracking provided by USPS.');
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