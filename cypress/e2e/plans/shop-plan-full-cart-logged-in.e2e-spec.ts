import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Select new plan with a full cart', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should click on sign in from the header', () => {
        PageObjects.HomePage.clickOnSignIn();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it('Should fill login info with valid data', () => {
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.EMPTY_PLANS_USER.EMAIL, CONSTANT.ACCESS.EMPTY_PLANS_USER.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary ', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on shop menu ', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should  click on plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select a plan', () => {
        PageObjects.Plans.clickOnPlan_1_GB();
    });
    it('Should click on I already have a phone', () => {
        PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
    });
    it('Should go check compatibility page', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
    });
    it('Should enter the IME number and address reference', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.IMEIS.IMEI_ATT);
        PageObjects.Compatibility.enterAddressRef();
        cy.get('[data-cy=equipmentNumber]').click();
    });
    it('Should check the recaptcha', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it('Should click on check phone button', () => {
        PageObjects.Compatibility.clickOnCheckPhoneButton();
    });
    it('Should go  compatibility result page', () => {
        PageObjects.TitleExpectations.goToCompatabilityResultPage();
    });
    it('Should click on proceed to checkout button', () => {
        PageObjects.Compatibility.clickOnProceedToCheckoutBtn();
    });
    it('Should go to shipping page an assert the plan to be 1GB', () => {
        PageObjects.TitleExpectations.goToShippingPage();
        cy.get(':nth-child(3) > .plan-details > :nth-child(1) > .title').should('have.text', '1GB 4G LTE');
    });
    it('Should fill shipping info1', () => {
        PageObjects.ShippingPage.addShippingInfo1(CONSTANT.SHIPPING.SHIPPING_DATA.NAME,
             CONSTANT.SHIPPING.SHIPPING_DATA.SHIPPING_ADDRESS,
             CONSTANT.SHIPPING.SHIPPING_DATA.SUITE_NO);
   });
   it('Should fill shipping info2', () => {
        PageObjects.ShippingPage.addShippingInfo2(CONSTANT.SHIPPING.VALID.CITY,
             CONSTANT.SHIPPING.SHIPPING_DATA.STATE,
             CONSTANT.SHIPPING.SHIPPING_DATA.POSTAL);
   });
   it('Should click on continue shipping', () => {
        PageObjects.ShippingPage.clickOnContinueShipping();
   });
   it('Should click on keep current address from pop up', () => {
        PageObjects.ShippingPage.chooseVerifiedAddress();
   });
    it('Should go to payment page and assert the plan to be 1GB', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
        cy.get(':nth-child(3) > .plan-details > :nth-child(1) > .title').should('have.text', '1GB 4G LTE');
    });
    it('Should fill in payment info', () => {
        PageObjects.BillingPage.addPaymentInfoForShipping(
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.PAN,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.CVV,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.NAME_ON_CARD);
    });
    it('Should chose the expiry month', () => {
        PageObjects.BillingPage.addMonth();
    });
    it('Should chose the expiry year', () => {
        PageObjects.BillingPage.addYear();
    });
    it('Should check the billing address is the same as shipping addres', () => {
        PageObjects.BillingPage.choseBillingAddressSameAsShipping();
    });
    it('Should click on continue button', () => {
        PageObjects.BillingPage.clickOnContinueBilling();
    });
    it('Should go to the place order page', () => {
        PageObjects.TitleExpectations.goToPlaceYourOrderPage();
        cy.get(':nth-child(3) > .plan-details > :nth-child(1) > .title').should('have.text', '1GB 4G LTE');
    });
    it('Should click on shop menu and shop for another plan', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should click on plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select another plan', () => {
        PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
    });
    it('Should go to payment page and assert that the plan was changed from 1GB to 2GB', () => {
        PageObjects.TitleExpectations.goToPaymentPage();
        cy.get(':nth-child(3) > .plan-details > :nth-child(1) > .title').should('have.text', '2GB 4G LTE');
    });
    it('Should fill in payment info', () => {
        PageObjects.BillingPage.addPaymentInfoForShipping(
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.PAN,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.CVV,
            CONSTANT.PAYMENT.CREDIT_CARD.VALID.NAME_ON_CARD);
    });
    it('Should chose the expiry month', () => {
        PageObjects.BillingPage.addMonth();
    });
    it('Should chose the expiry year', () => {
        PageObjects.BillingPage.addYear();
    });
    it('Should check the billing address is the same as shipping addres', () => {
        PageObjects.BillingPage.choseBillingAddressSameAsShipping();
    });
    it('Should click on continue button', () => {
        PageObjects.BillingPage.clickOnContinueBilling();
    });
    it('Should go to place order page and assert that the plan was changed from 1GB to 2GB', () => {
        PageObjects.TitleExpectations.goToPlaceYourOrderPage();
        cy.get(':nth-child(3) > .plan-details > :nth-child(1) > .title').should('have.text', '2GB 4G LTE');
    });
    it('Should click on remove plan from cart', () => {
        PageObjects.ShippingPage.clickOnRemoveOrder();
    });
    it('Should click yes btn from pop up ', () => {
        PageObjects.ShippingPage.clickOnYesBtnFromRemoveitemPopUp();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToHomePage();
    });
});

