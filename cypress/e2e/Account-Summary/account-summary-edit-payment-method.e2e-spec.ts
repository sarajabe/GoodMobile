import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

/* ********************************* */
/* Sign into account have at least one activated number and all the actions available ,then ensure from the links that go to the correct pages */
/* ********************************* */

describe('Sign in then go to account summary- edit the payment method', () => {
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
    it('Should click edit preferred payment', () => {
        PageObjects.AccountSummary.clickOnEditPreferredPaymentMethod();
    });
    it('Pop up should appear to select the first visa', () => {
        PageObjects.AccountSummary.clickOnAccountSummaryContainer();
    });
    it('Should click save button', () => {
        PageObjects.AccountSummary.clickOnSavePayment();
    });
    it('Should click yes to auto pay & save  button', () => {
        PageObjects.AccountSummary.clickOnYesToAutoPayAndSave();
    });
    it('Should click edit shipping address', () => {
        PageObjects.AccountSummary.clickOnEditShippingAddress();
    });
    it('Pop up should appear to select the new shipping address', () => {
        PageObjects.AccountSummary.clickOnAccountSummaryContainer();
    });
    it('Should click save button', () => {
        PageObjects.AccountSummary.clickOnSaveShippingAddress();
    });
    it('Should go to account summary page to edit payment method', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
});
