import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

/* ********************************* */
/* Sign in , insure from the links in header menu */
/* ********************************* */

describe('Sign in to insure from the links in header menu - no mdn', () => {
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
          PageObjects.AccessControl.logIn(CONSTANT.ACCESS.TEST_USER26_ACCOUNT.EMAIL, CONSTANT.ACCESS.TEST_USER26_ACCOUNT.PASSWORD);
     });
     it('Should click on login button', () => {
          PageObjects.AccessControl.logInButton();
     });
     it('Should go to account summary page', () => {
          PageObjects.TitleExpectations.goToAccountSummaryPage();
     });
     it('Should click on shop menu to shop for a new plan', () => {
          PageObjects.HomePage.clickOnShopMenu();
     });
     it('Should click on purchase new plan plans', () => {
          PageObjects.HomePage.clickOnPlans();
     });
     it('Should go to plans page', () => {
          PageObjects.TitleExpectations.goToPlansGMPage();
     });
     it('Should click on shop menu to shop for a new plan', () => {
          PageObjects.HomePage.clickOnShopMenu();
     });
     it('Should click on shop menu to shop for devices', () => {
          PageObjects.HomePage.clickOnDevices();
     });
     it('Should go to ACP devices page', () => {
          PageObjects.TitleExpectations.goToACPApplicationDevicesPage();
     });
     it('Should click on bring your phone link', () => {
          PageObjects.HomePage.clickOnBringYourPhone();
     });
     it('Should go to Keep Your Phone | Good2Go Mobile', () => {
          PageObjects.TitleExpectations.goToBringYourPhonePage();
     });
     it('Should click on get started button', () => {
          PageObjects.Compatibility.clickOnGetStartedBtn();
     });
     it('Should go to Check Compatibility page', () => {
          PageObjects.TitleExpectations.goToCheckCompatibilityPage();
     });
     it('Should click coverage link', () => {
          PageObjects.HomePage.clickOnCoverage();
     });
     it('Should go to Coverage page', () => {
          PageObjects.TitleExpectations.goToGMCoveragePage();
     });
     it('Should click activate link', () => {
          PageObjects.HomePage.clickOnActivate();
     });
     it('Should go to Sim check page', () => {
          PageObjects.TitleExpectations.goToSimCheckPage();
     });
});
