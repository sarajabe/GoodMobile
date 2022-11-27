import { PageObjects } from '../../../support/pageObjects'
import { CONSTANT } from '../../../fixtures/constants'


describe('Purchase a phone - new line - att coverage - not logged in - check the no checkbox for accepting limitations - go to home page', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.EMPTY_ACCOUNT.EMAIL, CONSTANT.ACCESS.EMPTY_ACCOUNT.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPageWithNoMDNS();
    });
    it('Should click on shop menu', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should click on phones', () => {
        PageObjects.HomePage.clickOnPhones();
    });
    it('Should go to phones page', () => {
        PageObjects.TitleExpectations.goToPhonesPage();
    });
    it('Should click on shop iphone', () => {
        PageObjects.PurchasedPhones.clickOnShopIphonePhones();
    });
    it('Should go to phones models page', () => {
        PageObjects.TitleExpectations.goToPhoneModelPage();
    });
    it('Should select 2nd phone', () => {
        PageObjects.PurchasedPhones.clickOnSelect3rdPhone();
   });
   it('Should go to phones phone details page', () => {
        PageObjects.TitleExpectations.goToPhoneDetailsPage();
   });
   it('Should select gray', () => {
        PageObjects.PurchasedPhones.clickOnXSGray();
   });
   it('Should select phone btn', () => {
        PageObjects.PurchasedPhones.clickOnSelecPhoneBtn();
   });
    it('Should sclick on add a new line', () => {
        PageObjects.PurchasedPhones.clickOnAddANewLine();
    });
    it('Should go to select line page', () => {
        PageObjects.TitleExpectations.goToSelectLinePage();
    });
    it('Should sclick on next', () => {
        PageObjects.PurchasedPhones.clickOnNextBtn();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select plan', () => {
        cy.get('#select-plan-GOOD2GO-20GB-50').click();
    });
    it('Should go to Service Coverage Check page', () => {
        PageObjects.TitleExpectations.goToServiceCoverageCheckPage();
    });
    it('Should enter an ATT address reference', () => {
        PageObjects.Coverage.enterAddressRefATT();
    });
    it('Should handle the invisible recaptcha here', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should click on check coverage btn', () => {
        PageObjects.PurchasedPhones.clickOncheckCoverageBtn();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should click on no i am not intrested - do not accept limitations', () => {
        PageObjects.PurchasedPhones.clickOnNoIamNotIntrested();
    });
    it('Should click on done btn', () => {
        PageObjects.PurchasedPhones.clickOnDoneBtn();
    });
    it('Should go to home page', () => {
        PageObjects.TitleExpectations.goToHomePage();
    });
});
