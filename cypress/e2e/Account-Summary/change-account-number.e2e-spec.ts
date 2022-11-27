import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

/* ********************************* */
/* Sign into account have numbers , then go account summary , and change the selected number */
/* ********************************* */

describe('Sign in then go to account summary to change the selected number', () => {
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
          PageObjects.AccessControl.logIn(CONSTANT.ACCESS.TEST3_ACCOUNT.EMAIL, CONSTANT.ACCESS.TEST3_ACCOUNT.PASSWORD);
     });
     it('Should click on login button', () => {
          PageObjects.AccessControl.logInButton();
     });
     it('Should go to account summary pageafter signing in', () => {
          PageObjects.TitleExpectations.goToAccountSummaryPage();
     });
     it('Should click on select mobile number to change the selected one ', () => {
          PageObjects.AccountSummary.phonePlanSelection();
     });
     it('Should go to account summary page after changinhg the number', () => {
          PageObjects.TitleExpectations.goToAccountSummaryPage();
     });
});
