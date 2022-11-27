import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

// enable, disable wifi callling with valid address and edit flows

describe('Enable, disable wifi callling with valid address then edit the address', () => {
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
     it('Should wait', () => {
          cy.wait(CONSTANT.TIME.SPEED_TIME.MAX);
     });
     it('Should click on edit wifi calling', () => {
          PageObjects.AccountSummary.clickOnEditWifiCalling();
     });
     it('Should wait', () => {
          cy.wait(CONSTANT.TIME.SPEED_TIME.MAX);
     });
     it('Should edit the address with new valid one section one', () => {
          PageObjects.WifiCallingMenu.editAddress(CONSTANT.PAYMENT.BILLING_DATA.VALID_4.ADDRESS,
               CONSTANT.PAYMENT.BILLING_DATA.VALID_4.SUITE_NO);
     });
     it('Should edit the address with new valid one section two', () => {
          PageObjects.WifiCallingMenu.addAddress2(CONSTANT.PAYMENT.BILLING_DATA.VALID_4.CITY,
               CONSTANT.PAYMENT.BILLING_DATA.VALID_4.STATE,
               CONSTANT.PAYMENT.BILLING_DATA.VALID_4.POSTAL);
     });
     it('Should click on activate button', () => {
          PageObjects.AccountSummary.clickOnActivateButton();
     });
     it('Should click on done button', () => {
          PageObjects.AccountSummary.clickOnActionButton();
     });
     it('Should wait', () => {
          cy.wait(CONSTANT.TIME.SPEED_TIME.MAX);
     });
});
