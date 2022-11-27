import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Select plan as existing customer - add payment method assertions', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_KK_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_KK_ACCOUNT.PASSWORD);
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
    it('should select shipping method', () => {
        cy.get('select').eq(1).select('Usps', { force: true }).should('have.value', 'usps');
        cy.get('select').eq(2).select('First Class Mail Shipping 3-7 Business days', { force: true }).should('have.value', 'usps_first_class_mail/letter');
    });
    it('should click on next', () => {
        PageObjects.ShippingPage.clickOnNextBtn();
    });
    it('Should go to payment page', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
    });
    it('should click on add another card', () => {
        PageObjects.Payment.clickOnAddAnotherCard();
    });
    it('should assert that the payment info form is opened', () => {
        cy.get('[data-cy="fullName"]').should('be.visible');
        cy.get('[data-cy="cardCode"]').should('be.visible')
    });
    it('should click on add another card again so we close the payment info form', () => {
        PageObjects.Payment.clickOnAddAnotherCard();
    });
    it('should assert that the payment info form is closed', () => {
        cy.get('[data-cy="fullName"]').should('not.exist');
        cy.get('[data-cy="cardCode"]').should('not.exist');
    });
    it('should click on add another card again to start asserting fields', () => {
        PageObjects.Payment.clickOnAddAnotherCard();
    });
    // Required fields
    it('should leave fields empty and click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the required validation messages', () => {
        cy.get('[data-cy="requiredNameMsg"]').should('have.text','Name on card is required. ');
        cy.get('[data-cy="requiredCardNoMsg"]').should('have.text','Card number is required. ');
        cy.get('[data-cy="cvvRequiredMsg"]').should('have.text','CVV is required. ');
        cy.get('[data-cy="expiryMonthRequiredMsg"]').should('have.text',' Expiration month is required ');
        cy.get('[data-cy="expiryYearRequiredMsg"]').should('have.text',' Expiration year is required ');
        cy.reload(true);
    });
    it('should click on add another card', () => {
        PageObjects.Payment.clickOnAddAnotherCard();
    });
    it('should keep name on card field empty', () => {
        PageObjects.Payment.fillInPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.VALID.NAME_ON_CARD,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.PAN,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.CVV);
        cy.get('select').eq(1).select('03', { force: true }).should('have.value', '03');
        cy.get('select').eq(2).select('34', { force: true }).should('have.value', '34');
        cy.get('[data-cy="fullName"]').clear();
    });
    it('should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the required name validation message', () => {
        cy.get('[data-cy="requiredNameMsg"]').should('have.text','Name on card is required. ');
    });
    it('should keep card number field empty', () => {
        PageObjects.Payment.fillInPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.VALID.NAME_ON_CARD,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.PAN,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.CVV);
        cy.get('select').eq(1).select('03', { force: true }).should('have.value', '03');
        cy.get('select').eq(2).select('34', { force: true }).should('have.value', '34');
        cy.get('[data-cy="cardNumber"]').clear();
    });
    it('should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the required card number validation message', () => {
        cy.get('[data-cy="requiredCardNoMsg"]').should('have.text','Card number is required. ');
    });
    it('should keep cvv field empty', () => {
        PageObjects.Payment.fillInPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.VALID.NAME_ON_CARD,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.PAN,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.CVV);
        cy.get('select').eq(1).select('03', { force: true }).should('have.value', '03');
        cy.get('select').eq(2).select('34', { force: true }).should('have.value', '34');
        cy.get('[data-cy="cardCode"]').clear();
    });
    it('should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the required cvv validation message', () => {
        cy.get('[data-cy="cvvRequiredMsg"]').should('have.text','CVV is required. ');
        cy.reload(true);
    });
    it('should click on add another card', () => {
        PageObjects.Payment.clickOnAddAnotherCard();
    });
    it('should keep expiry date empty', () => {
        PageObjects.Payment.fillInPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.VALID.NAME_ON_CARD,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.PAN,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.CVV);
    });
    it('should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the required expiry date validation messages', () => {
        cy.get('[data-cy="expiryMonthRequiredMsg"]').should('have.text',' Expiration month is required ');
        cy.get('[data-cy="expiryYearRequiredMsg"]').should('have.text',' Expiration year is required ');
    });
    it('should fill in payment info', () => {
        PageObjects.Payment.fillInPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.VALID.NAME_ON_CARD,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.PAN,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.CVV);
        cy.get('select').eq(1).select('03', { force: true }).should('have.value', '03');
        cy.get('select').eq(2).select('34', { force: true }).should('have.value', '34');
    });
    it('should uncheck the billing is same as shipping address box', () => {
        PageObjects.Payment.clickOnSameAsShippingAddress();
    });
    it('should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the required billing address fields', () => {
        cy.get('[data-cy="addressNameRequiredMsg"]').should('have.text','Address name is a required field');
        cy.get('[data-cy="addressRequiredMsg"]').should('have.text','Address is a Required Field');
        cy.get('[data-cy="cityIsRequired"]').should('have.text','City is a Required Field');
        cy.get('[data-cy="stateIsRequired"]').should('have.text','State is a Required Field ');
        cy.get('[data-cy="postalIsRequired"]').should('have.text','Postal Code is a Required Field');
    });
    it('should fill in billing info - except address name', () => {
        PageObjects.BillingPage.addBillingInfo1(CONSTANT.PAYMENT.BILLING_DATA.VALID.NAME,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.ADDRESS,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.SUITE_NO);
        PageObjects.BillingPage.addBillingInfo2(CONSTANT.PAYMENT.BILLING_DATA.VALID.CITY,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.STATE,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.POSTAL);
            cy.get('[data-cy="addressName"]').clear();
    });
    it('should assert the required billing address name field', () => {
        cy.get('[data-cy="addressNameRequiredMsg"]').should('have.text','Address name is a required field');
    });
    it('should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the required billing address name field', () => {
        cy.get('[data-cy="addressNameRequiredMsg"]').should('have.text','Address name is a required field');
    });
    it('should fill in billing info - except address1 ', () => {
        PageObjects.BillingPage.addBillingInfo1(CONSTANT.PAYMENT.BILLING_DATA.VALID.NAME,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.ADDRESS,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.SUITE_NO);
        PageObjects.BillingPage.addBillingInfo2(CONSTANT.PAYMENT.BILLING_DATA.VALID.CITY,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.STATE,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.POSTAL);
            cy.get('[data-cy="addressLookup"]').clear();
    });
    it('should assert the required billing address1 field validation message', () => {
        cy.get('[data-cy="addressRequiredMsg"]').should('have.text','Address is a Required Field');
    });
    it('should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the required billing address1 field validation message', () => {
        cy.get('[data-cy="addressRequiredMsg"]').should('have.text','Address is a Required Field');
    });
    it('should fill in billing info - except the city ', () => {
        PageObjects.BillingPage.addBillingInfo1(CONSTANT.PAYMENT.BILLING_DATA.VALID.NAME,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.ADDRESS,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.SUITE_NO);
        PageObjects.BillingPage.addBillingInfo2(CONSTANT.PAYMENT.BILLING_DATA.VALID.CITY,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.STATE,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.POSTAL);
            cy.get('[data-cy="billingCity"]').clear();
    });
    it('should assert the required billing city field validation message', () => {
        cy.get('[data-cy="cityIsRequired"]').should('have.text','City is a Required Field');
    });
    it('should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the required billing city field validation message', () => {
        cy.get('[data-cy="cityIsRequired"]').should('have.text','City is a Required Field');
    });
    it('should fill in billing info - except the state ', () => {
        PageObjects.BillingPage.addBillingInfo1(CONSTANT.PAYMENT.BILLING_DATA.VALID.NAME,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.ADDRESS,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.SUITE_NO);
        PageObjects.BillingPage.addBillingInfo2(CONSTANT.PAYMENT.BILLING_DATA.VALID.CITY,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.STATE,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.POSTAL);
            cy.get('[data-cy=billingState]').clear();
    });
    it('should assert the required billing state field validation message', () => {
        cy.get('[data-cy="stateIsRequired"]').should('have.text','State is a Required Field ');
    });
    it('should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the required billing state field validation message', () => {
        cy.get('[data-cy="stateIsRequired"]').should('have.text','State is a Required Field ');
    });
    it('should fill in billing info - except the postal code ', () => {
        PageObjects.BillingPage.addBillingInfo1(CONSTANT.PAYMENT.BILLING_DATA.VALID.NAME,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.ADDRESS,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.SUITE_NO);
        PageObjects.BillingPage.addBillingInfo2(CONSTANT.PAYMENT.BILLING_DATA.VALID.CITY,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.STATE,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.POSTAL);
            cy.get('[data-cy="billingPostal"]').clear();
    });
    it('should assert the required billing postal field validation message', () => {
        cy.get('[data-cy="postalIsRequired"]').should('have.text','Postal Code is a Required Field');
    });
    it('should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the required billing postal field validation message', () => {
        cy.get('[data-cy="postalIsRequired"]').should('have.text','Postal Code is a Required Field');
    });
    // Invalid fields
    it('should fill in valid payment fields - invalid card name ', () => {
        PageObjects.Payment.fillInPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.INVALID_NAME.NAME_ON_CARD,
            CONSTANT.PAYMENT.CREDIT_CARD.INVALID_NAME.PAN,
            CONSTANT.PAYMENT.CREDIT_CARD.INVALID_NAME.CVV);
        cy.get('select').eq(1).select('03', { force: true }).should('have.value', '03');
        cy.get('select').eq(2).select('34', { force: true }).should('have.value', '34');
    });
    it('should assert the invalid name field validation message', () => {
        cy.get('[data-cy="invalidNameOnCardMsg"]').should('have.text','Invalid Name. ');
    });
    it('should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the invalid name field validation message', () => {
        cy.get('[data-cy="invalidNameOnCardMsg"]').should('have.text','Invalid Name. ');
    });
    it('should fill in valid payment fields - invalid cvv', () => {
        PageObjects.Payment.fillInPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CVV.NAME_ON_CARD,
            CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CVV.PAN,
            CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CVV.CVV);
        cy.get('select').eq(1).select('03', { force: true }).should('have.value', '03');
        cy.get('select').eq(2).select('34', { force: true }).should('have.value', '34');
    });
    it('should assert the invalid cvv field validation message', () => {
        cy.get('[data-cy="cvvInvalidMsg"]').should('have.text','CVV is invalid. ');
    });
    it('should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the invalid cvv field validation message', () => {
        cy.get('[data-cy="cvvInvalidMsg"]').should('have.text','CVV is invalid. ');
    });
    it('should fill in valid payment fields - invalid expiry date', () => {
        PageObjects.Payment.fillInPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.VALID.NAME_ON_CARD,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.PAN,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.CVV);
        cy.get('select').eq(1).select('10', { force: true }).should('have.value', '10');
        cy.get('select').eq(2).select('22', { force: true }).should('have.value', '22');
    });
    it('should assert the expiry date is invalid', () => {
        cy.get('[data-cy="invalidExpiryDateMsg"]').should('have.text',' Expiration date must be valid ');
    });
    it('should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the expiry date is invalid', () => {
        cy.get('[data-cy="invalidExpiryDateMsg"]').should('have.text',' Expiration date must be valid ');
    });
    it('should fill in valid payment fields', () => {
        PageObjects.Payment.fillInPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.VALID.NAME_ON_CARD,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.PAN,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.CVV);
        cy.get('select').eq(1).select('12', { force: true }).should('have.value', '12');
        cy.get('select').eq(2).select('37', { force: true }).should('have.value', '37');
    });
    it('should fill in invalid billing fields', () => {
        PageObjects.BillingPage.addBillingInfo1(CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.NAME,
            CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.ADDRESS,
            CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.SUITE_NO);
        PageObjects.BillingPage.addBillingInfo2(CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.CITY,
            CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.STATE,
            CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.POSTAL);
    });
    it('should assert the invalid billing fields validation messages', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text','Invalid City ');
        cy.get('[data-cy="invalidStateMsg"]').should('have.text','Invalid State ');
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text','Invalid Postal Code ');
    });
    it('should fill in valid billing fields - space before city', () => {
        PageObjects.BillingPage.addBillingInfo1(CONSTANT.PAYMENT.BILLING_DATA.SPACE_BEFORE_CITY.NAME,
            CONSTANT.PAYMENT.BILLING_DATA.SPACE_BEFORE_CITY.ADDRESS,
            CONSTANT.PAYMENT.BILLING_DATA.SPACE_BEFORE_CITY.SUITE_NO);
        PageObjects.BillingPage.addBillingInfo2(CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.CITY,
            CONSTANT.PAYMENT.BILLING_DATA.SPACE_BEFORE_CITY.STATE,
            CONSTANT.PAYMENT.BILLING_DATA.SPACE_BEFORE_CITY.POSTAL);
    });
    it('should assert the invalid billing city validation message', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text','Invalid City ');
    });
    it('should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the invalid billing city validation message', () => {
        cy.get('[data-cy="invalidCityMsg"]').should('have.text','Invalid City ');
    });
    it('should fill in valid billing fields - space before postal', () => {
        PageObjects.BillingPage.addBillingInfo1(CONSTANT.PAYMENT.BILLING_DATA.SPACE_BEFORE_POSTAL.NAME,
            CONSTANT.PAYMENT.BILLING_DATA.SPACE_BEFORE_POSTAL.ADDRESS,
            CONSTANT.PAYMENT.BILLING_DATA.SPACE_BEFORE_POSTAL.SUITE_NO);
        PageObjects.BillingPage.addBillingInfo2(CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.CITY,
            CONSTANT.PAYMENT.BILLING_DATA.SPACE_BEFORE_POSTAL.STATE,
            CONSTANT.PAYMENT.BILLING_DATA.SPACE_BEFORE_POSTAL.POSTAL);
    });
    it('should assert the invalid billing postal validation message', () => {
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text','Invalid Postal Code ');
    });
    it('should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the invalid billing postal validation message', () => {
        cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text','Invalid Postal Code ');
    });
    it('should fill in valid billing fields - space before state', () => {
        PageObjects.BillingPage.addBillingInfo1(CONSTANT.PAYMENT.BILLING_DATA.SPACE_BEFORE_STATE.NAME,
            CONSTANT.PAYMENT.BILLING_DATA.SPACE_BEFORE_STATE.ADDRESS,
            CONSTANT.PAYMENT.BILLING_DATA.SPACE_BEFORE_STATE.SUITE_NO);
        PageObjects.BillingPage.addBillingInfo2(CONSTANT.PAYMENT.BILLING_DATA.SPACE_BEFORE_STATE.CITY,
            CONSTANT.PAYMENT.BILLING_DATA.SPACE_BEFORE_STATE.STATE,
            CONSTANT.PAYMENT.BILLING_DATA.SPACE_BEFORE_STATE.POSTAL);
    });
    it('should assert the invalid billing state validation message', () => {
        cy.get('[data-cy="invalidStateMsg"]').should('have.text','Invalid State ');
    });
    it('should click on save btn', () => {
        PageObjects.Payment.clickOnSaveBtn();
    });
    it('should assert the invalid billing state validation message', () => {
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        cy.get('[data-cy="invalidStateMsg"]').should('have.text','Invalid State ');
    });
    it('should click on cart icon', () => {
        PageObjects.HomePage.clickOnCartIcon();
    });
    it('Should go to review cart page', () => {
        PageObjects.TitleExpectations.goToPlansPage();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
        cy.get('.head-title').should('have.text', 'Review your cart');
    });
    it('Should empty the cart', () => {
        PageObjects.ReviewCart.clickOnEmptyCart();
    });
    it('Should confirm emptying cart from the pop up', () => {
        PageObjects.ReviewCart.clickOnYesEmptyBtnFromPopUp();
    });
    it('Should go to home page', () => {
        PageObjects.TitleExpectations.goToHomePage();
    });
    it('Should click on profile settings from the Account menu', () => {
        PageObjects.ProfileSettings.clickOnProfileSettingsFromAccountMenu();
    });
    it('Should go to profile settings page', () => {
        PageObjects.TitleExpectations.goToProfileSettingsPage();
    });
    it('Should click on X icon to remove payment method', () => {
        PageObjects.ProfileSettings.clickOnRemovePayment();
   });
   it('Should click on yes button', () => {
        PageObjects.ProfileSettings.clickOnSaveButtonFromPopUp();
   });
   
});
