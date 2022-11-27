import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to profile settings and edit the shipping address and save the changes', () => {
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
          PageObjects.AccessControl.logIn(CONSTANT.PROFILE.MOCK_DATA.EMAIL, CONSTANT.PROFILE.MOCK_DATA.NEW_PASSWORD);
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
     it('Should click on edit shipping address icon', () => {
          PageObjects.ProfileSettings.clickOnEditAddressIcon();
     });
     it('Should leave fields empty', () => {
          cy.get('[data-cy="addressName"]').clear();
          cy.get('[data-cy="addressLookup"]').clear();
          cy.get('[data-cy="suiteNo"]').clear();
          cy.get('[data-cy="billingCity"]').clear();
          cy.get('[data-cy="billingState"]').clear();
          cy.get('[data-cy="billingPostal"]').clear();
          cy.get('[data-cy="addressName"]').click();
     });
     it('Should assert the require validation messages', () => {
          cy.get('[data-cy="addressNameRequiredMsg"]').should('have.text', 'Address name is a required field');
          cy.get('[data-cy="addressRequiredMsg"]').should('have.text', 'Address is a Required Field');
          cy.get('[data-cy="stateIsRequired"]').should('have.text', 'State is a Required Field ');
          cy.get('[data-cy="cityIsRequired"]').should('have.text', 'City is a Required Field');
          cy.get('[data-cy="postalIsRequired"]').should('have.text', 'Postal Code is a Required Field');
     });
     it('Should check that the save button is disabled', () => {
          cy.get('[data-cy="save"]').should('be.disabled');
     });
     it('Should fill in invalid shipping data', () => {
          PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.INVALID_SHIPPING_DATA.NAME,
               CONSTANT.SHIPPING.INVALID_SHIPPING_DATA.SHIPPING_ADDRESS,
               CONSTANT.SHIPPING.INVALID_SHIPPING_DATA.SUITE_NO,
               CONSTANT.SHIPPING.INVALID_SHIPPING_DATA.CITY,
               CONSTANT.SHIPPING.INVALID_SHIPPING_DATA.STATE,
               CONSTANT.SHIPPING.INVALID_SHIPPING_DATA.POSTAL);
          cy.get('[data-cy="suiteNo"]').click();
     });
     it('Should assert the invalid validation messages', () => {
          cy.get('[data-cy="invalidCityMsg"]').should('have.text', 'Invalid City ');
          cy.get('[data-cy="invalidStateMsg"]').should('have.text', 'Invalid State ');
          cy.get('[data-cy="invalidPostalCodeMsg"]').should('have.text', 'Invalid Postal Code ');
     });
     it('Should check that the save button is disabled', () => {
          cy.get('[data-cy="save"]').should('be.disabled');
     });
     it('Should edit the shipping shipping address - valid info', () => {
          PageObjects.ShippingPage.editShippingAddress(CONSTANT.SHIPPING.SHIPPING_MOCK_DATA.NAME,
               CONSTANT.SHIPPING.SHIPPING_MOCK_DATA.SHIPPING_ADDRESS,
               CONSTANT.SHIPPING.SHIPPING_MOCK_DATA.SUITE_NO,
               CONSTANT.SHIPPING.SHIPPING_MOCK_DATA.CITY,
               CONSTANT.SHIPPING.SHIPPING_MOCK_DATA.STATE,
               CONSTANT.SHIPPING.SHIPPING_MOCK_DATA.POSTAL);
          cy.get('[data-cy="suiteNo"]').click();
     });
     it('Should click on save button', () => {
          PageObjects.ProfileSettings.clickOnSaveShippingInfo();
     });
     it('Should choose keep current address ', () => {
          PageObjects.ShippingPage.chooseKeepCurrentAddress();
     });
     it('Should go back to Settings page', () => {
          PageObjects.TitleExpectations.goToProfileSettingsPage();
     });
});
