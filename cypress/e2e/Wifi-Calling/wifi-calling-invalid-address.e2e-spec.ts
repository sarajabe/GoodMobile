import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

// enable wifi callling with invalid address

describe('Enable wifi callling with invalid address', () => {
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
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
        cy.wait(CONSTANT.TIME.SPEED_TIME.MAX);
    });
    it('Should disable wifi calling', () => {
        PageObjects.AccountSummary.clickOnWifiCallingSlider();
    });
    it('Should click on disable button', () => {
        PageObjects.AccountSummary.clickOnDisableButton();
    });
    it('Should wait', () => {
        cy.wait(CONSTANT.TIME.SPEED_TIME.MAX);
    });
    it('Should back to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should wait', () => {
        cy.wait(CONSTANT.TIME.SPEED_TIME.MAX);
    });
    it('Should enable wifi calling', () => {
        PageObjects.AccountSummary.clickOnWifiCallingSlider();
    });
    it('Should fill invalid address section one', () => {
        PageObjects.WifiCallingMenu.addAddress1(CONSTANT.PAYMENT.BILLING_DATA.INVALID_3.NAME,
            CONSTANT.PAYMENT.BILLING_DATA.INVALID_3.ADDRESS,
            CONSTANT.PAYMENT.BILLING_DATA.INVALID_3.SUITE_NO);
    });
    it('Should fill invalid address section two', () => {
        PageObjects.WifiCallingMenu.addAddress2(CONSTANT.PAYMENT.BILLING_DATA.INVALID_3.CITY,
            CONSTANT.PAYMENT.BILLING_DATA.INVALID_3.STATE,
            CONSTANT.PAYMENT.BILLING_DATA.INVALID_3.POSTAL);
    });
    it('Should click on activate button', () => {
        PageObjects.AccountSummary.clickOnActivateButton();
    });
    it('Should click on try again button', () => {
        PageObjects.AccountSummary.clickOnActionButton();
    });
});
