import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

/* ********************************* */
/* Do not sign in , select plan , click on i have a phone , then check compatibility
checkout as new customer , complete checkout */
/* ********************************* */

describe('Select plan as new customer', () => {
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
     it('Should enter the IME number and address reference', () => {
          PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.IMEIS.IMEI_ATT);
          PageObjects.Compatibility.enterAddressRef();
          cy.get('[data-cy=equipmentNumber]').click();
      });
      it('Should check recaptcha', () => {
          PageObjects.Recaptcha.invisibleRecaptcha();
      });
     it('Should click on check phone button', () => {
          PageObjects.Compatibility.clickOnCheckPhoneButton();
     });
     it('Should go to Compatability Result page', () => {
          PageObjects.TitleExpectations.goToCompatabilityResultPage();
     });
     it('Should add plan to cart', () => {
          PageObjects.Compatibility.clickOnProceedToCheckoutBtn();
     });
     it('Should go to checkout new customer', () => {
          PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
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
     });
     it('Should click on continue button', () => {
          PageObjects.AccessControl.signUpClick();
     });
     it('Should click on continue button in pop up window', () => {
          PageObjects.HomePage.clickOnContinue();
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
     it('Should go to payment page', () => {
          PageObjects.TitleExpectations.goToPaymentPage();
     });
     it('Should fill payment info', () => {
          PageObjects.BillingPage.addPaymentInfoForShipping(
               CONSTANT.PAYMENT.CREDIT_CARD.VALID.PAN,
               CONSTANT.PAYMENT.CREDIT_CARD.VALID.CVV,
               CONSTANT.PAYMENT.CREDIT_CARD.VALID.NAME_ON_CARD);
     });
     it('Should fill the date of card', () => {
          PageObjects.BillingPage.addMonth();
     });
     it('Should fill the date of card', () => {
          PageObjects.BillingPage.addYear();
     });
     it('Should check the billing address is the same as shipping addres', () => {
          PageObjects.BillingPage.choseBillingAddressSameAsShipping();
     });
     it('Should click on continue button', () => {
          PageObjects.BillingPage.clickOnContinueBilling();
     });
     it('Should click on Place your order button', () => {
          PageObjects.AccountSummary.clickOnPlaceYourOrder();
     });
     it('Should go to purchase successful page', () => {
          PageObjects.TitleExpectations.goToPurchaseSuccessfulPage();
     });
     it('Should click on Go to summary button', () => {
          PageObjects.AccountSummary.clickOnGoAccountToSummaryBtn();
     });
     it('Should go to account summary page', () => {
          PageObjects.TitleExpectations.goToAccountSummaryPage();
     });
});
