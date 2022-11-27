import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

/* ********************************* */
/* Sign into account have at least one activated number and all the actions available ,then ensure from the links that go to the correct pages */
/* ********************************* */

describe('Sign in then go to account summary to ensure from the links', () => {
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
    it('Should go to account summary page after signing in', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on change plan link', () => {
        PageObjects.AccountSummary.clickOnChangePlanLink();
    });
    it('Should go to change plan page', () => {
        PageObjects.TitleExpectations.goToChangePlanPage();
    });
    it('Should click on account menu ', () => {
        PageObjects.HomePage.clickOnMyAccount();
    });
    it('Should click on  account summary', () => {
        PageObjects.HomePage.clickOnAccountSummary();
    });
    it('Should go to account summary page  to cancel the plan', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on cancel plan link', () => {
        PageObjects.AccountSummary.clickOnCancelPlan();
    });
    it('Should go to Cancel plan page', () => {
        PageObjects.TitleExpectations.goToCancelPlanPage();
    });
    it('Should click on account menu  ', () => {
        PageObjects.HomePage.clickOnMyAccount();
    });
    it('Should click on  account summary to click on payment history', () => {
        PageObjects.HomePage.clickOnAccountSummary();
    });
    it('Should go to account summary page to click on payment history', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on payment history link', () => {
        PageObjects.AccountSummary.clickOnPaymentHistory();
    });
    it('Should go to Payment History page', () => {
        PageObjects.TitleExpectations.goToPaymentHistoryPage();
    });
    it('Should click on account menu  ', () => {
        PageObjects.HomePage.clickOnMyAccount();
    });
    it('Should click on  account summary to click on usage history link', () => {
        PageObjects.HomePage.clickOnAccountSummary();
    });
    it('Should go to account summary page  to click on usage history link', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on usage history link', () => {
        PageObjects.AccountSummary.clickOnUsageHistory();
    });
    it('Should go to Usage History page', () => {
        PageObjects.TitleExpectations.goToUsageHistoryPage();
    });
    it('Should click on account menu  ', () => {
        PageObjects.HomePage.clickOnMyAccount();
    });
    it('Should click on  account summary to purchase data add-ons', () => {
        PageObjects.HomePage.clickOnAccountSummary();
    });
    it('Should go to account summary page to purchase data add-ons', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on purchase now under add-ons data link', () => {
        PageObjects.AccountSummary.clickOnPurchaseNowFirstElement();
    });
    it('Should go to Plan addOns page ', () => {
        PageObjects.TitleExpectations.goToPlanAddOnsPage();
    });
    it('Should click on account menu  ', () => {
        PageObjects.HomePage.clickOnMyAccount();
    });
    it('Should click on  account summary to purchase international add-ons', () => {
        PageObjects.HomePage.clickOnAccountSummary();
    });
    it('Should go to account summary page to purchase international add-ons', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on purchase now under international data link', () => {
        PageObjects.AccountSummary.clickOnPurchaseNowSecondElement();
    });
    it('Should go to Plan addOns page ', () => {
        PageObjects.TitleExpectations.goToPlanAddOnsPage();
    });
    it('Should click on account menu  ', () => {
        PageObjects.HomePage.clickOnMyAccount();
    });
    it('Should click on  account summary to order add-ons', () => {
        PageObjects.HomePage.clickOnAccountSummary();
    });
    it('Should go to account summary page to order add-ons', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on order add-ons link', () => {
        PageObjects.AccountSummary.clickOnOrderAddOns();
    });
    it('Should go to Plan addOns page ', () => {
        PageObjects.TitleExpectations.goToPlanAddOnsPage();
    });
    it('Should click on account menu  ', () => {
        PageObjects.HomePage.clickOnMyAccount();
    });
    it('Should click on  account summary to click on manage devices link', () => {
        PageObjects.HomePage.clickOnAccountSummary();
    });
    it('Should go to account summary page to click on manage devices link', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on manage devices link', () => {
        PageObjects.AccountSummary.clickOnManageDevices();
    });
    it('Should go to Phone Details page', () => {
        PageObjects.TitleExpectations.goToPhoneDetailsPage();
    });
    it('Should click on account menu to edit payment method ', () => {
        PageObjects.HomePage.clickOnMyAccount();
    });
    it('Should click on  account summary to edit payment method', () => {
        PageObjects.HomePage.clickOnAccountSummary();
    });
    it('Should go to account summary page to edit payment method', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
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
    it('Should go to account summary ', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
});
