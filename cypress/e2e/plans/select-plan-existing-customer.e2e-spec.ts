import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

/* ********************************* */
/* Do not sign in , select plan , click on i have a phone , then check compatibility
checkout as existing customer , complete checkout */
/* ********************************* */


describe('Select plan as existing customer ', () => {
     before(() => {
          PageObjects.BeforeAll.executeBeforeAll();
     });
     after(() => {
          PageObjects.AccessControl.logoutFromAccount();
     });
     it('Should click on shop menu ', () => {
          PageObjects.HomePage.clickOnShopMenu();
     });
     it('Should click on plans', () => {
          PageObjects.HomePage.clickOnPlans();
     });
     it('Should go to plans page', () => {
          PageObjects.TitleExpectations.goToPlansG2GPage();
     });
     it('Should select plan', () => {
          PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
     });
     it('Should click on i already have a phone', () => {
          PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
     });
     it(`Should go to Check Your Phone's Compatibility page`, () => {
          PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
     });
     it('Should click on skip for now link 2', () => {
          PageObjects.Plans.clickOnSkipForNow();
     });
     it('Should click on yes from skip device popup', () => {
          PageObjects.Plans.clickOnYesSkipDevice();
     });
     it('Should go to checkout page 2', () => {
          PageObjects.TitleExpectations.goToCheckoutNewCustomerPage();
     });
     it('Should click on  existing customer tab', () => {
          PageObjects.HomePage.clickOnExistingCustomerTab();
     });
     it('Should insert valid info for existing customer', () => {
          PageObjects.AccessControl.existingCustomerLogin(CONSTANT.ACCESS.SUM_ACCOUNT.EMAIL, CONSTANT.ACCESS.SUM_ACCOUNT.PASSWORD);
     });
     it('Should click on continue button in pop up window', () => {
          PageObjects.HomePage.clickOnContinue();
     });
     it('should select shipping address successfully ', () => {
          PageObjects.ShippingPage.selectShippingInfo();
     });
     it('Should click on continue shipping', () => {
          PageObjects.ShippingPage.clickOnContinueShipping();
     });
     it('should select payment method successfully ', () => {
          PageObjects.BillingPage.selectPaymentMethod();
     });
     it('Should click on continue button', () => {
          PageObjects.BillingPage.clickOnContinueBilling();
     });
     it('Should go to place order page', () => {
          PageObjects.TitleExpectations.goToPlaceYourOrderPage();
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

