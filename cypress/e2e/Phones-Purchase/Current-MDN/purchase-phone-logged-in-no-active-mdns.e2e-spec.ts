import { PageObjects } from '../../../support/pageObjects'
import { CONSTANT } from '../../../fixtures/constants'

describe('Purchase a phone - logged in user - no active mdns', () => {
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
          PageObjects.AccessControl.logIn(CONSTANT.ACCESS.SUM_ACCOUNT.EMAIL, CONSTANT.ACCESS.SUM_ACCOUNT.PASSWORD);
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
     it('Should click on phones', () => {
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
     it('Should go to select line page', () => {
          PageObjects.TitleExpectations.goToSelectLinePage();
     });
     it('Should click on current mobile number', () => {
          PageObjects.PurchasedPhones.clickOnCurrentMobileNumber();
     });
     it('Should click on next', () => {
          PageObjects.PurchasedPhones.clickOnNextBtn();
     });
     it('Should check the validation text to be : You Don`t Have an Active Mobile Number. Please add a new line to proceed.', () => {
          cy.get('.validation-message').should('have.text', 'You Don’t Have an Active Mobile Number. Please add a new line to proceed.');
     });
     it('Should stay in select line page', () => {
          PageObjects.TitleExpectations.goToSelectLinePage();
     });

});

