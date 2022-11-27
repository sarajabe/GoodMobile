import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

/* ********************************* */
/* Sign in , go to manage device & sim , sim replacement Proceed to chekcout by saved credit card
without click on place your order */
/* ********************************* */

describe('Sign in , go to manage device & sim , sim replacement Proceed to chekcout by saved credit card', () => {
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
          PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_L_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_L_ACCOUNT.PASSWORD);
     });
     it('Should click on login button', () => {
          PageObjects.AccessControl.logInButton();
     });
     it('Should go to account summary page', () => {
          PageObjects.TitleExpectations.goToAccountSummaryPage();
     });
     it('Should wait til info is fetched', () => {
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
     });
     it('click on manage device and sim', () => {
          PageObjects.AccountSummary.clickOnManageDeviceAndSim();
     });
     it('Should go to manage devices page', () => {
          PageObjects.TitleExpectations.goToManageDevicesPage();
     });
     it('Should wait ', () => {
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
     });
     it('Should click on proceed to checkout under sim replacement section', () => {
          PageObjects.ManageDevices.clickOnProceedToCheckoutBtn();
     });
     it('Should go to shipping page', () => {
          PageObjects.TitleExpectations.goToShippingPage();
     });
     it('should select shipping address successfully ', () => {
          PageObjects.ShippingPage.selectShippingInfo();
     });
     it('Should click on continue shipping', () => {
          PageObjects.ShippingPage.clickOnContinueShipping();
     });
     it('Should go to payment page', () => {
          PageObjects.TitleExpectations.goToPaymentPage();
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL0);
     });
     it('should select payment method successfully ', () => {
          PageObjects.BillingPage.selectPaymentMethod();
     });
     it('Should click on continue button', () => {
          PageObjects.BillingPage.clickOnContinueBilling();
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
     });
     it('Should wait ', () => {
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
     });
     it('Should go to place order page', () => {
          PageObjects.TitleExpectations.goToPlaceYourOrderPage();
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL0);
     });
     it('Should click on remove to remove the plan', () => {
          PageObjects.AccountSummary.clickOnRemovePlan();
     });
     it('Should click on yes button to agree remove the plan', () => {
          PageObjects.BillingPage.clickOnYesRemoveItemFromPopUp();
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
     });
     it('Should go back to manage devices page', () => {
          PageObjects.TitleExpectations.goToManageDevicesPage();
     });
});
