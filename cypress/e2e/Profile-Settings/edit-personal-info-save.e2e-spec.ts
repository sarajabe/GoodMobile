import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to profile settings and edit the personal information and save the changes', () => {
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
     it('Should click on change name in personal information section', () => {
          PageObjects.ProfileSettings.clickOnChangeName();
     });
     it('Should change the name successfully', () => {
          PageObjects.ProfileSettings.changeName(CONSTANT.PROFILE.MOCK_DATA.FIRST_NAME, CONSTANT.PROFILE.MOCK_DATA.SECOND_NAME);
     });
     it('Should click on save changes button', () => {
          PageObjects.ProfileSettings.clickOnSaveNameChange();
     });
     it('Should click on change email in personal information section', () => {
          PageObjects.ProfileSettings.clickOnChangeEmail();
     });
     it('Should change the email successfully', () => {
          PageObjects.ProfileSettings.changeEmail(CONSTANT.PROFILE.MOCK_DATA.EMAIL);
     });
     it('Should make sure that the save btn is enabled', () => {
          cy.get('[data-cy=saveEmailButton]').should('not.be.disabled');
     });
});
