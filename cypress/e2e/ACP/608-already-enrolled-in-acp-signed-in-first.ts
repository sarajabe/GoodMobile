import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in with account that already purchased ACP plan - check plan btn', () => {
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
     it('Should click on shop menu to click on plans', () => {
          PageObjects.HomePage.clickOnShopMenu();
     });
     it('Should click on plans', () => {
          PageObjects.HomePage.clickOnPurchaseNewPlan();
     });
     it('Should go to plans page', () => {
          PageObjects.TitleExpectations.goToPlansG2GPage();
     });
     it('Should be able to see 1/1 purchased as text for the button', () => {
         cy.get('[data-cy="check-qualification"]').should('have.text','1/1 purchased ');
     });
     it('Should click on learn more btn', () => {
          PageObjects.Acp.clickOnLearnMoreBtn();
     });
     it('Should click on got it btn from pop up', () => {
          PageObjects.Acp.clickOnGotItBtnFromPopUp();
     });
     it('Should stay in plans page', () => {
          PageObjects.TitleExpectations.goToPlansG2GPage();
     });
});