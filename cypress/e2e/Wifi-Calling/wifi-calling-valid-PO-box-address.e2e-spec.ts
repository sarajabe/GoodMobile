import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'
// enable wifi callling with valid PO box address

describe('Enable wifi callling with valid PO box address', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_KK_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_KK_ACCOUNT.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should wait til info is fetched', () => {
        cy.wait(CONSTANT.TIME.SPEED_TIME.MAX);
    });
    it('Should enable wifi calling', () => {
        PageObjects.AccountSummary.clickOnWifiCallingSlider();
    });
    it('Should fill valid PO box address section one', () => {
        PageObjects.WifiCallingMenu.addAddress1(CONSTANT.PAYMENT.BILLING_DATA.VALID_PO_BOX.NAME,
            CONSTANT.PAYMENT.BILLING_DATA.VALID_PO_BOX.ADDRESS,
            CONSTANT.PAYMENT.BILLING_DATA.VALID_PO_BOX.SUITE_NO);
    });
    it('Should fill valid PO box address section two', () => {
        PageObjects.WifiCallingMenu.addAddress2(CONSTANT.PAYMENT.BILLING_DATA.VALID_PO_BOX.CITY,
            CONSTANT.PAYMENT.BILLING_DATA.VALID_PO_BOX.STATE,
            CONSTANT.PAYMENT.BILLING_DATA.VALID_PO_BOX.POSTAL);
    });
    it('Should click on activate button', () => {
        PageObjects.AccountSummary.clickOnActivateButton();
    });
    it('Should wait', () => {
        cy.wait(CONSTANT.TIME.SPEED_TIME.MAX);
    });
    it('Should click on try again button', () => {
        PageObjects.AccountSummary.clickOnActionButton();
    });
});
