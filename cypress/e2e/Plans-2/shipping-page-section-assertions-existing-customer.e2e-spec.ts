import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Select plan as existing customer - add shipping address assertions - required and invalid validation messages', () => {
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
    it('Should fill login info with valid data', () => {
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.TEST_USER.EMAIL, CONSTANT.ACCESS.TEST_USER.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
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
    it('Should click on save btn', () => {
        PageObjects.ShippingPage.clickOnSaveBtn();
    });
    it('Should assert the required validation messages', () => {
        cy.get('[data-cy="addressNameRequiredMsg"]').should('have.text', 'Address name is a required field');
        cy.get('[data-cy="addressRequiredMsg"]').should('have.text', 'Address is a Required Field');
        cy.get('[data-cy="cityIsRequired"]').should('have.text', 'City is a Required Field');
        cy.get('[data-cy="stateIsRequired"]').should('have.text', 'State is a Required Field ');
        cy.get('[data-cy="postalIsRequired"]').should('have.text', 'Postal Code is a Required Field');
    });
    it('Should fill in invalid city, state, and postal code address data whith numbers', () => {
        PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.SHIPPING_DATA.NAME,
            CONSTANT.SHIPPING.SHIPPING_DATA.SHIPPING_ADDRESS,
            CONSTANT.SHIPPING.SHIPPING_DATA.SUITE_NO,
            CONSTANT.SHIPPING.INVALID_ADDRESS.CITY,
            CONSTANT.SHIPPING.INVALID_ADDRESS.STATE,
            CONSTANT.SHIPPING.INVALID_ADDRESS.POSTAL);
    });
    it('Should click on save btn', () => {
        PageObjects.ShippingPage.clickOnSaveBtn();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
        cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
    });
    it('Should fill in invalid city, state, and postal code address data start with space', () => {
        PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.SHIPPING_DATA.NAME,
            CONSTANT.SHIPPING.SHIPPING_DATA.SHIPPING_ADDRESS,
            CONSTANT.SHIPPING.SHIPPING_DATA.SUITE_NO,
            CONSTANT.SHIPPING.CITY_BEGIN_WITH_SPACE.CITY,
            CONSTANT.SHIPPING.STATE_BEGIN_WITH_SPACE.STATE,
            CONSTANT.SHIPPING.POSTAL_BEGIN_WITH_SPACE.POSTAL);
    });
    it('Should click on save btn', () => {
        PageObjects.ShippingPage.clickOnSaveBtn();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
        cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
    });
    it('Should fill in invalid city, state, and postal code address data start with space', () => {
        PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.SHIPPING_DATA.NAME,
            CONSTANT.SHIPPING.SHIPPING_DATA.SHIPPING_ADDRESS,
            CONSTANT.SHIPPING.SHIPPING_DATA.SUITE_NO,
            CONSTANT.SHIPPING.ADDRESS_HAS_SPECIAL_CHARACTERS.CITY,
            CONSTANT.SHIPPING.ADDRESS_HAS_SPECIAL_CHARACTERS.STATE,
            CONSTANT.SHIPPING.ADDRESS_HAS_SPECIAL_CHARACTERS.POSTAL);
    });
    it('Should click on save btn', () => {
        PageObjects.ShippingPage.clickOnSaveBtn();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
        cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
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
    it('should click on next', () => {
        PageObjects.ShippingPage.clickOnNextBtn();
    });
    it('Should assert the invalid validation messages', () => {
        cy.get(':nth-child(1) > #required-shipping-service-msg').should('have.text', ' Shipping service is required ');
        cy.get(':nth-child(2) > #required-shipping-service-msg').should('have.text', ' Delivery option is required ');
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
    it('should select second payment method', () => {
        PageObjects.Payment.selectFirstPaymentMethod();
    });
    it('should click on next', () => {
        PageObjects.Payment.clickOnNextBtn();
    });
    it('Should go to purchase successful page', () => {
        PageObjects.TitleExpectations.goToPlaceYourOrderPage();
    });
    it('Should assert that the delivery method', () => {
        cy.get('[data-cy="deliveryMethod"]').should('have.text', 'Home Delivery');
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
        cy.get('[data-cy="deliveryMethod"]').should('have.text', 'Store Pickup');
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
