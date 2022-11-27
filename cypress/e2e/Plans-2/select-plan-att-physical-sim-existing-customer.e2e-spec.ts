import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Select plan as existing - ATT - physical sim', () => {
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
    it('Should assert auto pay discount to be -$5', () => {
        cy.get('[data-cy="autoPayDiscount"]').should('have.text', '-$5/m');
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_G_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_G_ACCOUNT.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
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
    it('should select payment method', () => {
        PageObjects.Payment.selectFirstPaymentMethod();
    });
    it('should click on next', () => {
        PageObjects.Payment.clickOnNextBtn();
    });
    it('Should go to place order page', () => {
        PageObjects.TitleExpectations.goToPlaceYourOrderPage();
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
    it('Should assert that shipping fees equals to $0.00', () => {
        cy.get('[data-cy="shippingFees"]').should('have.text', '$0.00');
    });
    it('Should assert that the taxes fees are calculated correctly', () => {
        cy.get('[data-cy="taxesFees"]').should('have.text', '$2.14');
    });
    it('Should assert that sim type is SIM', () => {
        cy.get('[data-cy="simType"]').should('have.text', 'SIM Card');
    });
    it('Should assert that the SIM  quantity equals to 1', () => {
        cy.get('[data-cy="simQuantity"]').should('have.text', 'Quantity: 1');
    });
    it('Should assert that the total equals to Total: $18.77', () => {
        cy.get('.subtotal').should('have.text', ' Total: $18.77 ');
    });
    it('Should assert that the shipping method is', () => {
        cy.get('[data-cy="shippingMethod"]').should('have.text', 'First Class Mail Shipping 3-7 Business days');
    });
    it('Should click on submit btn', () => {
        PageObjects.PlaceOrder.clickOnSubmitBtn();
    });
    it('Should go to to purchase successful page', () => {
        PageObjects.TitleExpectations.goToPurchaseSuccessfulPage();
    });
    it('Should assert that the purchased sim is physical SIM', () => {
        cy.get('.col-12 > :nth-child(4)').should('have.text',
            'Look out for your new SIM card in the mail! Once your SIM card arrives in a couple of days, we will help you get your SIM card activated with a brand new phone number, or transfer your active number (port in) from another provider. You can view your plan details and activate it through your Purchased Plans page. ')
    });
    it('Should click on Purchased Plans btn', () => {
        PageObjects.PurchaseSuccessful.clickOnPurchasedPlansBtn();
    });
    it('Should go to to purchased plans page', () => {
        PageObjects.TitleExpectations.goToPurchasedPlansPage();
    });
    it('Should assert that the activate btn has text of physical SIM activation', () => {
        cy.get('[data-cy="activatePlanBtn"]').should('have.text', 'Activate Plan');
    });


});
