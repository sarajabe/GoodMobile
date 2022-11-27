import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

// enable wifi callling with valid address and unchecked checkboxes

describe('Enable wifi callling with valid address and unchecked checkboxes', () => {
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
    it('Should wait', () => {
        cy.wait(CONSTANT.TIME.SPEED_TIME.MAX);
    });
    it('Should fill valid address section one', () => {
        PageObjects.WifiCallingMenu.addAddress1(CONSTANT.PAYMENT.BILLING_DATA.VALID.NAME,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.ADDRESS,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.SUITE_NO);
    });
    it('Should fill valid address section two', () => {
        PageObjects.WifiCallingMenu.addAddress2(CONSTANT.PAYMENT.BILLING_DATA.VALID.CITY,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.STATE,
            CONSTANT.PAYMENT.BILLING_DATA.VALID.POSTAL);
    });
    it('Should unchecked the both checkboxes', () => {
        PageObjects.AccountSummary.clickOnTermsCheckbox();
        PageObjects.AccountSummary.clickOnUpdateCheckbox();
    });
    it('The activate button should be disabled', () => {
        PageObjects.AccountSummary.checkActivateButtonToBeDisabled();
    });
    it('Should exit from the menu', () => {
        PageObjects.AccountSummary.clickOnIconClose();
    });
});
