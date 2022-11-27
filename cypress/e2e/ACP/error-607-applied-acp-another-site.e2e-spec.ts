import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in with an account that had laready applied for the ACP from other site - must', () => {
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
          PageObjects.AccessControl.logIn(CONSTANT.ACCESS.APPLIED_ACP.EMAIL, CONSTANT.ACCESS.APPLIED_ACP.PASSWORD);
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
          PageObjects.HomePage.clickOnPlans();
     });
     it('Should go to plans page', () => {
          PageObjects.TitleExpectations.goToPlansG2GPage();
     });
     it('Should click on learn more btn', () => {
          PageObjects.Acp.clickOnLearnMoreBtn();
     });
     it('Should go to ACP page', () => {
          PageObjects.TitleExpectations.goToACPPage();
     });
     it('Should click on apply now button', () => {
          PageObjects.Acp.clickOnApplyNowBtn();
     });
     it('Should go to ACP validate page- step 4 page', () => {
          PageObjects.TitleExpectations.goToACPEnrollemntPage();
     });
     it('Should go to ACP validate page- step 4 page', () => {
          cy.get('.right > .button').should('not.be.disabled');
     });
});
