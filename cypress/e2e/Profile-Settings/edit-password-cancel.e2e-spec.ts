import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to profile settings and edit the password and cancel the changes', () => {
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
     it('Should click on change password', () => {
          PageObjects.ProfileSettings.clickOnChangePassword();
     });
     it('Should change the password successfully', () => {
          PageObjects.ProfileSettings.changePassword(CONSTANT.PROFILE.MOCK_DATA.CURRENT_PASSWORD, CONSTANT.PROFILE.MOCK_DATA.NEW_PASSWORD);
     });
     it('Should click on Cancel button', () => {
          PageObjects.ProfileSettings.clickOnCancelPasswordChanges();
     });
});
