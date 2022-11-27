import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'


/* ********************************* */
/* Sign into account have at an activated number
/* check the checkbox then unchecked the auto pay checkbox 
/* ********************************* */
describe('Sign in then go to account summary then pay and refill', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.TEST15_USER.EMAIL, CONSTANT.ACCESS.TEST15_USER.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on the auto pay checkbox to be checked ', () => {
        PageObjects.AccountSummary.clickOnAutoPayCheckBox();
    });
    it('Should click on yes to auto pay and save', () => {
        PageObjects.AccountSummary.clickOnYesToAutoPay();
    });
    it('should select payment method', () => {
        PageObjects.PayAndRefill.selectFirstPaymentMethod();
    });
    it('Should click on save btn', () => {
        PageObjects.PayAndRefill.clickOnSavePaymentMethodBtn();
    });
    it('Should click on the auto pay checkbox to be unchecked ', () => {
        PageObjects.AccountSummary.clickOnAutoPayCheckBox();
    });
    it('Disable auto pay pop up should appear, click on yes', () => {
        PageObjects.PayAndRefill.DisableTheAutoPay();
    });
    it('Should go back to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
});
