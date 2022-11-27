import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Select plan as existing customer - Autto pay assertions', () => {
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
    it('Should enter covered address - ATT', () => {
        PageObjects.Coverage.enterAddressRefATTCoverages();
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
    it('Should enter the IMEI number - ATT', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.ATT_ONLY.ATT1);
    });
    it('Should click on check your phone btn', () => {
        PageObjects.Compatibility.clickOnCheckYourDevice();
    });
    it('Should go to Compatability Result page', () => {
        PageObjects.TitleExpectations.goToCompatabilityResultPage();
    });
    it('Should assert the congrats message', () => {
        cy.get('[data-cy="compatibilityResult"]').should('have.text', ' Congrats!');
    });
    it('Should click on proceed to checkout', () => {
        PageObjects.Compatibility.clickOnProceedToCheckoutBtn();
    });
    it('Should go to review cart page', () => {
        PageObjects.TitleExpectations.goToPlansPage();
        cy.get('.head-title').should('have.text', 'Review your cart');
    });
    it('Should assert the SIM card type to be physical SIM', () => {
        cy.get('[data-cy="simType-CartItems"]').should('have.text', 'SIM Card');
    });
    // auto pay discount checked
    it('Should assert auto pay discount to be -$5', () => {
        cy.get('[data-cy="autoPayDiscount"]').should('have.text', '-$5/m');
    });
    it('Should assert that the total equals to', () => {
        cy.get('[data-cy="subtotal"]').should('have.text', 'Item(s) price: $15.00');
    });
    it('Should uncheck the auto pay checkbox', () => {
        PageObjects.ReviewCart.clickOnAutoPayCheckBox();
    });
    it('Should close the pop up', () => {
        PageObjects.ReviewCart.closePopUpIcon();
    });
    it('Should assert auto pay discount to be -$5', () => {
        cy.get('[data-cy="autoPayDiscount"]').should('have.text', '-$5/m');
    });
    it('Should assert that the total equals to $15.00', () => {
        cy.get('[data-cy="subtotal"]').should('have.text', 'Item(s) price: $15.00');
    });
    it('Should uncheck the auto pay checkbox', () => {
        PageObjects.ReviewCart.clickOnAutoPayCheckBox();
    });
    it('Should click on no btn', () => {
        PageObjects.ReviewCart.clickOnNoBtn();
    });
    it('Should assert auto pay discount to be -$5', () => {
        cy.get('[data-cy="autoPayDiscount"]').should('have.text', '-$5/m');
    });
    it('Should assert that the total equals to $15.00', () => {
        cy.get('[data-cy="subtotal"]').should('have.text', 'Item(s) price: $15.00');
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
    it('Should go to shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('Should assert that the total equals to $15.00', () => {
        cy.get('[data-cy="total"]').should('have.text','Est. Total:$15.00');
    });
    it('should select shipping address successfully ', () => {
        PageObjects.ShippingPage.selectShippingInfo();
    });
    it('should select shipping address', () => {
        cy.get('select').eq(1).select('Usps', { force: true }).should('have.value', 'usps');
        cy.get('select').eq(2).select('First Class Mail Shipping 3-7 Business days', { force: true }).should('have.value', 'usps_first_class_mail/letter');
    });
    it('should click on next', () => {
        PageObjects.ShippingPage.clickOnNextBtn();
    });
    it('Should go to payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('Should assert that the total equals to $15.00', () => {
        cy.get('[data-cy="total"]').should('have.text','Est. Total:$15.00');
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
    it('Should assert that the total equals to $18.77', () => {
        cy.get('[data-cy="total"]').should('have.text','Est. Total:$18.77');
    });
    it('Should assert that we have the shipping details', () => {
        cy.get('[data-cy="deliveryDetails"]').should('exist');
    });
    it('Should assert that the shipped sim quantity equals to one', () => {
        cy.get('[data-cy="SIMCard"]').should('have.text','SIM Card');
        cy.get('[data-cy="shippedSimQuantity"]').should('have.text','Quantity: 1');
    });
    it('Should assert that the discount total equals to $5.00', () => {
        cy.get('[data-cy="discountValue"]').should('have.text', '$5.00');
    });
    it('Should assert that the total equals to Total: $18.77 ', () => {
        cy.get('.subtotal').should('have.text', ' Total: $18.77 ');
    });
    it('should click on back btn', () => {
        PageObjects.PlaceOrder.clickOnBackBtn();
    });
    it('Should go to payment page', () => {
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('should click on back btn', () => {
        PageObjects.Payment.clickOnBackBtn();
    });
    it('Should go to shipping page', () => {
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('should click on back btn', () => {
        PageObjects.ShippingPage.clickOnBackBtn();
    });
    it('Should go to review cart page', () => {
        PageObjects.TitleExpectations.goToPlansPage();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        cy.get('.head-title').should('have.text', 'Review your cart');
    });
    it('Should assert that the discount total equals to -$5.00', () => {
        cy.get('[data-cy="autoPayDiscount"]').should('have.text', '-$5/m');
    });
    it('Should assert that the total equals to Total: $15.00 ', () => {
        cy.get('.subtotal').should('have.text', 'Item(s) price: $15.00');
    });
    // auto pay unchecked
    it('Should uncheck the auto pay checkbox', () => {
        PageObjects.ReviewCart.clickOnAutoPayCheckBox();
    });
    it('Should click yes no btn', () => {
        PageObjects.ReviewCart.clickOnYesBtn();
    });
    it('Should assert auto pay discount to be -$5', () => {
        cy.get('[data-cy="autoPayDiscount"]').should('have.text', '-$5/m');
    });
    it('Should assert that the  subtotal total equals to $20.00', () => {
        cy.get('[data-cy="subtotal"]').should('have.text', 'Item(s) price: $20.00');
    });
    it('Should click on checkout btn', () => {
        PageObjects.ReviewCart.clickOnCheckoutBtn();
    });
    it('Should go to payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('Should assert that the total estimtion equals to $20.00', () => {
        cy.get('[data-cy="total"]').should('have.text','Est. Total:$20.00');
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
    it('Should assert that the total equals to $24.54', () => {
        cy.get('[data-cy="total"]').should('have.text','Est. Total:$24.54');
    });
    it('Should assert that the sbtotal total equals to $24.54', () => {
        cy.get('.subtotal').should('have.text', ' Total: $24.54 ');
    });

});
