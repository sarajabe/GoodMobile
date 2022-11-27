import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

/* ********************************* */
/* Sign in , insure from the links in account menu */
/* ********************************* */

describe('Sign in to insure from the links in account menu', () => {
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
    it('Should click on account menu from header', () => {
        PageObjects.HomePage.clickOnMyAccount();
    });
    it('Should click on  account summary ', () => {
        PageObjects.HomePage.clickOnAccountSummary();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on account menu to check purchased plans ', () => {
        PageObjects.HomePage.clickOnMyAccount();
    });
    it('Should click on  purchased Plans ', () => {
        PageObjects.HomePage.clickOnPurchasedPlan();
    });
    it('Should go to Purchased Plans page', () => {
        PageObjects.TitleExpectations.goToPurchasedPlansPage();
    });
    it('Should click on account menu  to refill the account', () => {
        PageObjects.HomePage.clickOnMyAccount();
    });
    it('Should click on refill account ', () => {
        PageObjects.HomePage.clickOnRefillAccount();
    });
    it('Should go to Account Pay and Renew page', () => {
        PageObjects.TitleExpectations.goToPayAndRefillPage();
    });
    it('Should click on account menu  to click on plans addons', () => {
        PageObjects.HomePage.clickOnMyAccount();
    });
    it('Should click on  plan-addOns ', () => {
        PageObjects.HomePage.clickOnPlanAddOns();
    });
    it('Should go to Plan addOns page', () => {
        PageObjects.TitleExpectations.goToPlanAddOnsPage();
    });
    it('Should click on account menu to check the payment history', () => {
        PageObjects.HomePage.clickOnMyAccount();
    });
    it('Should click on payment history header', () => {
        PageObjects.HomePage.clickOnPaymentHistory();
    });
    it('Should go to Payment History page', () => {
        PageObjects.TitleExpectations.goToPaymentHistoryPage();
    });
    it('Should click on account menu to check the usage history', () => {
        PageObjects.HomePage.clickOnMyAccount();
    });
    it('Should click on  usage history ', () => {
        PageObjects.HomePage.clickOnUsageHistory();
    });
    it('Should go to Usage History page', () => {
        PageObjects.TitleExpectations.goToUsageHistoryPage();
    });
    it('Should click on account menu to manage the device ', () => {
        PageObjects.HomePage.clickOnMyAccount();
    });
    it('Should click on  manage Device ', () => {
        PageObjects.HomePage.clickOnManageDevice();
    });
    it('Should go to Manage Devices page', () => {
        PageObjects.TitleExpectations.goToManageDevicesPage();
    });
    it('Should click on account menu to check the profile settings ', () => {
        PageObjects.HomePage.clickOnMyAccount();
    });
    it('Should click on  profile Setting ', () => {
        PageObjects.HomePage.clickOnProfileSetting();
    });
    it('Should go to Settings page', () => {
        PageObjects.TitleExpectations.goToProfileSettingsPage();
    });
});
