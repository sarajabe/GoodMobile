import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to profile settings and edit the payment method and save the changes', () => {
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
          PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_KK_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_KK_ACCOUNT.PASSWORD);
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
     it('Should add valid payment method', () => {
          PageObjects.BillingPage.addPaymentInfo(
               CONSTANT.PAYMENT.CREDIT_CARD.VALID_MOCK.PAN,
               CONSTANT.PAYMENT.CREDIT_CARD.VALID_MOCK.NAME_ON_CARD,
               CONSTANT.PAYMENT.CREDIT_CARD.VALID_MOCK.CVV);
          PageObjects.BillingPage.addDate();
          PageObjects.BillingPage.addBillingInfo1(CONSTANT.PAYMENT.BILLING_DATA.VALID_MOCK.NAME,
               CONSTANT.PAYMENT.BILLING_DATA.VALID_MOCK.ADDRESS,
               CONSTANT.PAYMENT.BILLING_DATA.VALID_MOCK.SUITE_NO);
          PageObjects.BillingPage.addBillingInfo2(CONSTANT.PAYMENT.BILLING_DATA.VALID_MOCK.CITY,
               CONSTANT.PAYMENT.BILLING_DATA.VALID_MOCK.STATE,
               CONSTANT.PAYMENT.BILLING_DATA.VALID_MOCK.POSTAL);
     });
     it('Should check recaptcha', () => {
          PageObjects.Recaptcha.invisibleRecaptcha();
     });
     it('Should click on save button', () => {
          PageObjects.ProfileSettings.clickOnSaveNewPayment();
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL1);
     });
     it('Should go back to Settings page', () => {
          PageObjects.TitleExpectations.goToProfileSettingsPage();
     });
     it('Should click on edit payment method icon', () => {
          PageObjects.ProfileSettings.clickOnEditPaymentIcon();
     });
     it('Should click on edit payment address', () => {
          PageObjects.ProfileSettings.clickOnEditPaymentAddress();
     });
     it('Should click on update payment button', () => {
          PageObjects.ProfileSettings.clickOnUpdatePaymentMethodButton();
     });
     it('Should assert the required cvv validation messages', () => {
          cy.get('[data-cy="cvvRequiredMsg"]').should('have.text', ' CVV is required. ');  
     });
     it('Should leave name and cvv fields empty ', () => {
          cy.get('[data-cy="nameField"]').click({ force: true });
          cy.get('[data-cy="nameField"]').clear();
          cy.get('[data-cy="cardCodeField"]').click({ force: true });
          cy.get('[data-cy="cardCodeField"]').clear();
          cy.get('[data-cy="nameField"]').click({ force: true });
     });
     it('Should leave address fields empty ', () => {
          cy.get('[data-cy="addressNameField"]').click();
          cy.get('[data-cy="addressNameField"]').clear();
          cy.get('[data-cy="addressLookup"]').click();
          cy.get('[data-cy="addressLookup"]').clear();
          cy.get('[data-cy="stateField"]').click();
          cy.get('[data-cy="stateField"]').clear();
          cy.get('[data-cy="cityField"]').click();
          cy.get('[data-cy="cityField"]').clear();
          cy.get('[data-cy="zipField"]').click();
          cy.get('[data-cy="zipField"]').clear();
          cy.get('[data-cy="addressNameField"]').click();
     });
     it('Should assert the required validation messages', () => {
          cy.get('[data-cy="nameOnCardRequiredMsg"]').should('have.text', ' Name on card is required. ');
          cy.get('[data-cy="cvvRequiredMsg"]').should('have.text', ' CVV is required. ');
          cy.get('[data-cy="addressNameRequiredMsg"]').should('have.text', ' Name is required. ');
          cy.get('[data-cy="addressLineRequiredMsg"]').should('have.text', ' Address is required. ');
          cy.get('[data-cy="stateRequiredMsg"]').should('have.text', ' State is required. ');
          cy.get('[data-cy="cityRequiredMsg"]').should('have.text', ' City is required. ');
          cy.get('[data-cy="zipRequiredMsg"]').should('have.text', ' ZIP code is required. ');
     });
     it('Should fill in invalid payment details', () => {
          PageObjects.BillingPage.editPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CARD.NAME_ON_CARD,
               CONSTANT.PAYMENT.CREDIT_CARD.INVALID_CARD.CVV);
          PageObjects.BillingPage.addDate();
     });
     it('Should fill in invalid payment address details', () => {
          PageObjects.BillingPage.editPaymenAddresstInfo(CONSTANT.SHIPPING.INVALID_ADDRESS.NAME,
               CONSTANT.SHIPPING.INVALID_ADDRESS.ADDRESS1,
               CONSTANT.SHIPPING.INVALID_ADDRESS.STATE,
               CONSTANT.SHIPPING.INVALID_ADDRESS.CITY,
               CONSTANT.SHIPPING.INVALID_ADDRESS.POSTAL);
     });
     it('Should assert the invalid validtion messages', () => {
          cy.get('[data-cy="invalidName"]').should('have.text', ' Invalid Name. ');
          cy.get('[data-cy="cvvInvalidMsg"]').should('have.text', ' CVV is invalid. ')
          cy.get('[data-cy="stateInvalidMsg"]').should('have.text', ' State is invalid. ');
          cy.get('[data-cy="cityInvalidMsg"]').should('have.text', ' City is invalid. ');
          cy.get('[data-cy="zipInvalidMsg"]').should('have.text', ' ZIP code is invalid. ');
     });
     it('Should fill in valid payment details', () => {
          PageObjects.BillingPage.editPaymentInfo(CONSTANT.PAYMENT.CREDIT_CARD.VALID_MOCK.NAME_ON_CARD, CONSTANT.PAYMENT.CREDIT_CARD.VALID_MOCK.CVV);
          PageObjects.BillingPage.addDate();
     });
     it('Should fill in valid payment address details', () => {
          PageObjects.BillingPage.editPaymenAddresstInfo(CONSTANT.SHIPPING.VALID.NAME,
               CONSTANT.SHIPPING.VALID.ADDRESS,
               CONSTANT.SHIPPING.VALID.STATE,
               CONSTANT.SHIPPING.VALID.CITY,
               CONSTANT.SHIPPING.VALID.POSTAL);
     });
     it('Should click on update payment button', () => {
          PageObjects.ProfileSettings.clickOnUpdatePaymentMethodButton();
     });
     it('Should go back to Settings page', () => {
          PageObjects.TitleExpectations.goToProfileSettingsPage();
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
