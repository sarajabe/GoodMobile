import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

// data setup tmo for iPhone

describe('Data setup tmo for iPhone ', () => {
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
    it('Should click on data setup link from the footer', () => {
        PageObjects.Footer.clickOnSetUpYourData();
    });
    it('Should go to Data Setup page', () => {
        PageObjects.TitleExpectations.goToSetupYourPhoneDataPage();
    });
    it('Should fill the phone Number', () => {
        PageObjects.DataSetup.enterPhoneNumber(CONSTANT.DATA_SETUP.PHONE_NUMBER);
    });
    it('Should click on iPhone button', () => {
        PageObjects.DataSetup.clickOnIphoneButton();
    });
    it('Should go to Data Setup page for tmo ', () => {
        PageObjects.TitleExpectations.goToSetupYourPhoneDataPage();
    });
    it('The url should include support/data-setup/tmo/ios', () => {
        cy.url().should('eq',`${CONSTANT.URLS.DOMAIN}/support/data-setup/tmo/ios`);
    });
});
