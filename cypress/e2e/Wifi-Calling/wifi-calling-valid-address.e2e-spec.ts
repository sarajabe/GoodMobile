import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

//  disable, enable wifi callling with valid address

describe('Enable, disable wifi callling with valid address', () => {
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
    });
    it('Should wait til info is fetched', () => {
        cy.wait(CONSTANT.TIME.SPEED_TIME.MAX);
    });
    it('Should disable wifi calling', () => {
        PageObjects.AccountSummary.clickOnWifiCallingSlider();
    });
    it('Should click on disable button', () => {
        PageObjects.AccountSummary.clickOnDisableButton();
    });
    it('Should go to back account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should wait', () => {
        cy.wait(CONSTANT.TIME.SPEED_TIME.MAX);
    });
    it('Should enable wifi calling', () => {
        PageObjects.AccountSummary.clickOnWifiCallingSlider();
    });
    it('Should wait til info is fetched', () => {
        cy.wait(CONSTANT.TIME.SPEED_TIME.MAX);
    });
    it('Should edit the address with new valid one section one', () => {
        PageObjects.WifiCallingMenu.addAddress1(
            CONSTANT.PAYMENT.BILLING_DATA.VALID_2.NAME,
            CONSTANT.PAYMENT.BILLING_DATA.VALID_2.ADDRESS,
            CONSTANT.PAYMENT.BILLING_DATA.VALID_2.SUITE_NO);
    });
    it('Should edit the address with new valid one section two', () => {
        PageObjects.WifiCallingMenu.addAddress2(CONSTANT.PAYMENT.BILLING_DATA.VALID_2.CITY,
            CONSTANT.PAYMENT.BILLING_DATA.VALID_2.STATE,
            CONSTANT.PAYMENT.BILLING_DATA.VALID_2.POSTAL);
    });
    it('Should close icon', () => {
        PageObjects.AccountSummary.clickOnIconClose();
    });
});
