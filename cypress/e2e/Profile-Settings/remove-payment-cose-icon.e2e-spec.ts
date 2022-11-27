import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to profile settings then remove test the pop up (No, close icon) buttons and assert that the payment wasn’t removed', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.TEST1_USER.EMAIL, CONSTANT.ACCESS.TEST1_USER.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on Profile settings', () => {
        PageObjects.AccountSummary.clickOnProfileSetting();
    });
    it('Should go to Settings page', () => {
        PageObjects.TitleExpectations.goToProfileSettingsPage();
    });
    it('Should click on X icon to remove payment method', () => {
        PageObjects.ProfileSettings.clickOnRemovePayment();
    });
    it('Should click on no btn from delete payment pop up', () => {
        PageObjects.ProfileSettings.clickOnNoBtnFromDeletePaymentPopUp();
    });
    it('Should assert that the payment wasn’t removed', () => {
        cy.get('.info-details > .info').should('contain','VISA  Ending in 1111, Expiration date: 08/2028 ');
    });
    it('Should click on X icon to remove payment method', () => {
        PageObjects.ProfileSettings.clickOnRemovePayment();
    });
    it('Should click on close icon', () => {
        PageObjects.ProfileSettings.clickOnCloseIcon();
    });
    it('Should assert that the payment wasn’t removed', () => {
        cy.get('.info-details > .info').should('contain','VISA  Ending in 1111, Expiration date: 08/2028 ');
    });
});