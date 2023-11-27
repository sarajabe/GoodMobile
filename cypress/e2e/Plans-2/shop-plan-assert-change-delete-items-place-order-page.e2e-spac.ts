import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Shop plan then assert, change, and delete item', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully', () => {
        PageObjects.AccessControl.successfulLogin();
    });
    it('Should click on shop menu ', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansGMPage();
    });
    it('Click on 6GB add to cart', () => {
        PageObjects.Plans.clickOn6GB_From_Plans_Page();
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
    it('Should assert plan title to have 6GB', () => {
        cy.get('[data-cy="basePlan"]').should('have.text', '6GB 4G LTE Plan');
    });
    it('Should assert plan quantity', () => {
        cy.get('[data-cy="planQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('Should assert that sim type is SIM Card', () => {
        cy.get('[data-cy="simType-CartItems"]').should('have.text', 'SIM Card');
    });
    it('Should assert SIM quantity', () => {
        cy.get('[data-cy="simQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('Should click on checkout btn', () => {
        PageObjects.ReviewCart.clickOnCheckoutBtn();
    });
    it('Should go to shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('Click on home delivery', () => {
        PageObjects.ShippingPage.clickOnHomeDelivery();
    });
    it('Should select shipping address successfully ', () => {
        PageObjects.ShippingPage.selectShippingInfo();
    });
    it('Should select shipping address', () => {
        cy.get('select').eq(2).select('USPS', { force: true }).should('have.value', 'usps');
        cy.get('select').eq(3).select('First Class Mail Shipping 3-7 Business days', { force: true }).should('have.value', 'usps_first_class_mail/letter');
    });
    it('should click on next', () => {
        PageObjects.ShippingPage.clickOnNextBtn();
    });
    it('Should go to payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('should select second payment method', () => {
        PageObjects.Payment.selectSecondPaymentMethod();
    });
    it('should click on next', () => {
        PageObjects.Payment.clickOnNextBtn();
    });
    it('Should go to purchase successful page', () => {
        PageObjects.TitleExpectations.goToPlaceYourOrderPage();
    });
    it('Should assert that the Subtotal equals to $20.00', () => {
        cy.get('[data-cy="subtotal"]').should('have.text', '$20.00');
    });
    it('Should assert that the discount total equals to $0.00', () => {
        cy.get('[data-cy="discountValue"]').should('have.text', '$0.00');
    });
    it('Should assert that shipping fees equals to $0.00', () => {
        cy.get('[data-cy="shippingFees"]').should('have.text', '$0.00');
    });
    it('Should assert that the taxes fees are calculated correctly', () => {
        cy.get('[data-cy="taxesFees"]').should('have.text', '$2.36');
    });
    it('Should assert that the total equals to  Total: $24.54', () => {
        cy.get('.subtotal').should('have.text', ' Total: $24.54 ');
    });
    it('Should assert plan title to have 6GB', () => {
        cy.get('[data-cy="basePlan"]').should('have.text', '6GB 4G LTE Plan');
    });
    it('Should assert plan quantity', () => {
        cy.get('[data-cy="planQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('Should assert that sim type is SIM', () => {
        cy.get('[data-cy="simType"]').should('have.text', 'SIM Card');
    });
    it('Should assert SIM quantity', () => {
        cy.get('[data-cy="simQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('Should assert that the total equals to  Total:$24.54', () => {
        cy.get('[data-cy="total"]').should('have.text','Total:$24.54');
    });
    it('Should assert that the delivery method', () => {
        cy.get('[data-cy="deliveryMethod"]').should('have.text', 'Home Delivery ');
    });
    it('Should assert that the shipping method ', () => {
        cy.get('[data-cy="shippingMethod"]').should('have.text', 'First Class Mail Shipping 3-7 Business days');
    });
    it('Should assert that the credit card brand', () => {
        cy.get('[data-cy="cardBrand"]').should('have.text', 'Visa Card');
    });
    it('Should assert that the Billing Address full name and address', () => {
        cy.get('[data-cy="billingAddressInfo"]').should('have.text', 'TEST, 123 WILLIAM ST');
    });
    it('Should click on change address', () => {
        PageObjects.PlaceOrder.clickOnChangeShippingAddress();
    });
    it('Should go to shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('Click on store pickup', () => {
        PageObjects.ShippingPage.clickOnStorePickup();
    });
    it('Click on the barcode checkbox', () => {
        cy.get('#barCodeVal').click();
    });
    it('should click on next', () => {
        PageObjects.ShippingPage.clickOnNextBtn();
    });
    it('Should go to purchase successful page', () => {
        PageObjects.TitleExpectations.goToPlaceYourOrderPage();
    });
    it('Should assert that the delivery method', () => {
        cy.get('[data-cy="deliveryMethod"]').should('have.text', 'Store Pickup ');
    });
    it('should click on change payment', () => {
        PageObjects.PlaceOrder.clickOnChangePyment();
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
    it('Should go to purchase successful page', () => {
        PageObjects.TitleExpectations.goToPlaceYourOrderPage();
    });
    it('Should assert that the credit card brand', () => {
        cy.get('[data-cy="cardBrand"]').should('have.text', 'Visa Card');
    });
    it('Should assert that the Billing Address full name and address', () => {
        cy.get('[data-cy="billingAddressInfo"]').should('have.text', 'RANA HADDAD, 4445 ROCK QUARRY ROAD');
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