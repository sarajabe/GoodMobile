import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

/* ********************************* */
/* Sign in , insure from the links in header menu */
/* ********************************* */

describe('Sign in to insure from the links in header menu', () => {
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
          PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_G_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_G_ACCOUNT.PASSWORD);
     });
     it('Should click on login button', () => {
          PageObjects.AccessControl.logInButton();
     });
     it('Should go to account summary page', () => {
          PageObjects.TitleExpectations.goToAccountSummaryPage();
     });
     it('Should wait', () => {
          cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL4);
     });
     it('Should click on shop menu ', () => {
          PageObjects.HomePage.clickOnShopMenu();
     });
     it('Should click on new plans', () => {
          PageObjects.HomePage.clickOnPurchaseNewPlan();
     });
     it('Should go to plans page', () => {
          PageObjects.TitleExpectations.goToPlansG2GPage();
     });
     it('Should click on shop menu to click on purchase phone ', () => {
          PageObjects.HomePage.clickOnShopMenu();
     });
     it('Should click on purchase phone', () => {
          PageObjects.HomePage.clickOnPurchasePhone();
     });
     it('Should go to phones page', () => {
          PageObjects.TitleExpectations.goToPhonesPage();
     });
     it('Should click on shop menu to click on change plan ', () => {
          PageObjects.HomePage.clickOnShopMenu();
     });
     it('Should click on change plan', () => {
          PageObjects.HomePage.clickOnChangePlan();
     });
     it('Should go to change plan page', () => {
          PageObjects.TitleExpectations.goToChangePlanPage();
     });
     it('Should click on shop menu to click on order add-ons ', () => {
          PageObjects.HomePage.clickOnShopMenu();
     });
     it('Should click on order add-ons', () => {
          PageObjects.HomePage.clickOnOrderAddOns();
     });
     it('Should go to Plan addOns page', () => {
          PageObjects.TitleExpectations.goToPlanAddOnsPage();
     });
     it('Should click on bring your phone link', () => {
          PageObjects.HomePage.clickOnBringYourPhone();
     });
     it('Should go to Keep Your Phone | Good2Go Mobile page', () => {
          PageObjects.TitleExpectations.goToBringYourPhonePage();
     });
     it('Should click coverage link', () => {
          PageObjects.HomePage.clickOnCoverage();
     });
     it('Should go to Coverage page', () => {
          PageObjects.TitleExpectations.goToGood2GoCoveragePage();
     });
});
