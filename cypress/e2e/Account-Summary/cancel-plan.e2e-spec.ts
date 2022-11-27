import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

/* ********************************* */
/* Sign into account have numbers , then go account summary , and cancel the plan */
/* ********************************* */

describe('Sign in then go to account summary and cancel the plan', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_L_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_L_ACCOUNT.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on cancel plan', () => {
        PageObjects.AccountSummary.clickOnCancelPlan();
    });
    it('Should go to Cancel plan page', () => {
        PageObjects.TitleExpectations.goToCancelPlanPage();
    });
    it('Should click on yes, cancel plan button', () => {
        PageObjects.AccountSummary.clickOnYesCancelPlan();
    });
    it('Should click on close icon in pop up window', () => {
        PageObjects.AccountSummary.clickOnIconClose();
    });
});
