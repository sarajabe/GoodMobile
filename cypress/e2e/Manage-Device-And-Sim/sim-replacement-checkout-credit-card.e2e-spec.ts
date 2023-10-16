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
          PageObjects.AccessControl.logIn(CONSTANT.ACCESS.TEST_USER.EMAIL, CONSTANT.ACCESS.TEST_USER.PASSWORD);
     });
     it('Should click on login button', () => {
          PageObjects.AccessControl.logInButton();
     });
     it('Should go to account summary page', () => {
          PageObjects.TitleExpectations.goToAccountSummaryPage();
     });
     it('click on manage device and sim', () => {
          PageObjects.AccountSummary.clickOnManageDeviceAndSim();
     });
     it('Should go to manage devices page', () => {
          PageObjects.TitleExpectations.goToManageDevicesPage();
     });
     it('Should click Get a Replacement SIM', () => {
          PageObjects.ManageDevices.clickOnGetReplacementSIM();
     });
     it('Should go to review cart page', () => {
          PageObjects.TitleExpectations.goToReviewCartPage();
          cy.get('.head-title').should('have.text', 'Review your cart');
     });
     it('Should assert Replacement Sim cart type', () => {
          cy.get('[data-cy="replacementSimCartType"]').should('have.text', '(Replacement Sim)');
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
     it('should select shipping address successfully ', () => {
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
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL0);
     });
     it('should select payment method successfully ', () => {
          PageObjects.Payment.selectFirstPaymentMethod();
     });
     it('should click on next', () => {
          PageObjects.Payment.clickOnNextBtn();
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
     });
     it('Should go to place order page', () => {
          PageObjects.TitleExpectations.goToPlaceYourOrderPage();
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL0);
     });
     it('should delete the plan', () => {
          PageObjects.PlaceOrder.deletePlan();
     });
     it('Should click on yes button to agree remove the plan', () => {
          PageObjects.BillingPage.clickOnYesRemoveItemFromPopUp();
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
     });
     it('Should go back to manage devices page', () => {
          PageObjects.TitleExpectations.goToManageDevicesPage();
     });
});
