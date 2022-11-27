import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to profile settings and make default payment method', () => {
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
     it('Should click on change payment in billing details section to make it default', () => {
          PageObjects.ProfileSettings.clickOnChangePayment();
     });
     it('Should click on payment list then select the first cart to make it default', () => {
          cy.get('select[name="payment-list"]').select('visa Ending in 1111, Expiration Date 07/30', { force: true }).should('have.value', '2: Object');
     });
     it('Should click on make default payment button', () => {
          PageObjects.ProfileSettings.clickOnMakeDefaultPayment();
     });
     it('Should go back to Settings page', () => {
          PageObjects.TitleExpectations.goToProfileSettingsPage();
     });
});
