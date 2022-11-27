import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to profile settings then add new payment and remove it', () => {
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
          PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_G_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_G_ACCOUNT.PASSWORD);
     });
     it('Should click on login button', () => {
          PageObjects.AccessControl.logInButton();
     });
     it('Should go to account summary page', () => {
          PageObjects.TitleExpectations.goToAccountSummaryPage();
     });
     it('Should click on Profile settings', () => {
          PageObjects.AccountSummary.clickOnProfileSetting();
     });
     it('Should go to Settings page', () => {
          PageObjects.TitleExpectations.goToProfileSettingsPage();
     });
     it('Should click on add another payment method', () => {
          PageObjects.ProfileSettings.clickOnAddAnotherPayment();
     });
     it('Should check recaptcha', () => {
          PageObjects.Recaptcha.invisibleRecaptcha();
     });
     it('Should leave fields empty and click on save button', () => {
          PageObjects.ProfileSettings.clickOnSaveNewPayment();
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
     });
     it('Should assert the required validation messages', () => {
          cy.get('[data-cy="invalidCreditCardMsg"]').should('have.text','Invalid Credit Card Number. ');
          cy.get('[data-cy="nameOnCardRequiredMsg"]').should('have.text','Name on card is required. ');
          cy.get('[data-cy="cvvRequiredMsg"]').should('have.text','CVV is required field. ');
          cy.get('[data-cy="expiryMonthRequiredMsg"]').should('have.text',' Expiration month is required ');
          cy.get('[data-cy="expiryYearRequiredMsg"]').should('have.text',' Expiration year is required ');
          cy.get('[data-cy="addressNameRequiredMsg"]').should('have.text','Address alias is required field');
          cy.get('[data-cy="addressRequiredMsg"]').should('have.text','Address is a Required Field');
          cy.get('[data-cy="cityIsRequired"]').should('have.text','City is a Required Field');
          cy.get('[data-cy="stateIsRequired"]').should('have.text','State is a Required Field ');
          cy.get('[data-cy="postalIsRequired"]').should('have.text','Postal Code is a Required Field');
     });
     // fill in invalid info
     it('Should fill in invalid credit card and billing address', () => {
          PageObjects.BillingPage.addPaymentInfoProcess(
               CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CARD.PAN,
               CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CARD.NAME_ON_CARD,
               CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CARD.CVV);
          cy.get('select').eq(1).select('11', { force: true }).should('have.value', '11');
          cy.get('select').eq(2).select('32', { force: true }).should('have.value', '32');
          PageObjects.BillingPage.addBillingInfo1(CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.NAME,
               CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.ADDRESS,
               CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.SUITE_NO);
          PageObjects.BillingPage.addBillingInfo2(CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.CITY,
               CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.STATE,
               CONSTANT.PAYMENT.BILLING_DATA.INVALID_DATA.POSTAL);
     });
     it('Should check recaptcha', () => {
          PageObjects.Recaptcha.invisibleRecaptcha();
     });
     it('Should click on save button', () => {
          PageObjects.ProfileSettings.clickOnSaveNewPayment();
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
     });
     it('Should assert the invalid validation messages', () => {
          cy.get('[data-cy="cvvInvalidMsg"]').should('have.text','CVV is invalid. ');
          cy.get('[data-cy="invalidName"]').should('have.text','Invalid name. ');
          cy.get('[data-cy=cardNumber]').should('be.visible');
          cy.get('[data-cy="invalidCityMsg"]').should('have.text','Invalid City ');
          cy.get('[data-cy="invalidStateMsg"]').should('have.text','Invalid State ');
          cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text','Invalid Postal Code ');
     });
     // valid data
     it('Should add valid payment method', () => {
          PageObjects.BillingPage.addPaymentInfo(
               CONSTANT.PAYMENT.CREDIT_CARD.VALID_MOCK.PAN,
               CONSTANT.PAYMENT.CREDIT_CARD.VALID_MOCK.NAME_ON_CARD,
               CONSTANT.PAYMENT.CREDIT_CARD.VALID_MOCK.CVV);
          PageObjects.BillingPage.addDate();
          PageObjects.BillingPage.addBillingInfo1(CONSTANT.PAYMENT.BILLING_DATA.VALID_MOCK_2.NAME,
               CONSTANT.PAYMENT.BILLING_DATA.VALID_MOCK_2.ADDRESS,
               CONSTANT.PAYMENT.BILLING_DATA.VALID_MOCK_2.SUITE_NO);
          PageObjects.BillingPage.addBillingInfo2(CONSTANT.PAYMENT.BILLING_DATA.VALID_MOCK_2.CITY,
               CONSTANT.PAYMENT.BILLING_DATA.VALID_MOCK_2.STATE,
               CONSTANT.PAYMENT.BILLING_DATA.VALID_MOCK_2.POSTAL);
     });
     it('Should check recaptcha', () => {
          PageObjects.Recaptcha.invisibleRecaptcha();
     });
     it('Should click on save button', () => {
          PageObjects.ProfileSettings.clickOnSaveNewPayment();
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
     });
     it('Should click on all payment methhods to delete the last added oe', () => {
          PageObjects.ProfileSettings.clickOnAllPaymentsMethod();
     });
     it('Should click on X icon to remove payment method', () => {
          PageObjects.ProfileSettings.clickOnRemovePayment();
     });
     it('Should click on yes button', () => {
          PageObjects.ProfileSettings.clickOnSaveButtonFromPopUp();
     });
});
