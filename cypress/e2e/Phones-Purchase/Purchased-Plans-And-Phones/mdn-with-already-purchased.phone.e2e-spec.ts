import { PageObjects } from '../../../support/pageObjects'
import { CONSTANT } from '../../../fixtures/constants'


describe('Purchase phone limit with current mdn that has already purchased a phone before', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_KK_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_KK_ACCOUNT.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on shop menu ', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should click on puchase a new plan', () => {
        PageObjects.HomePage.clickOnPurchasePhone();
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
    it('Should select 3nd phone', () => {
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
   it('Should go to select line page', () => {
    PageObjects.TitleExpectations.goToSelectLinePage();
});
it('Should click on current mobile number', () => {
    PageObjects.PurchasedPhones.clickOnCurrentMobileNumber();
});
it('Should assert the limit message - no plans available for current mdn', () => {
    cy.get('[data-cy="no-available-plans-validation"]').should('have.text','Your active numbers are already associated with purchased phones. Please add a new line to proceed.')
});
});
