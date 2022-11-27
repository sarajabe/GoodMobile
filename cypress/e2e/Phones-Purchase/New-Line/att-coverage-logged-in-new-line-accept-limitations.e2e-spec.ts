import { PageObjects } from '../../../support/pageObjects'
import { CONSTANT } from '../../../fixtures/constants'

describe('Purchase a phone - new line - att coverage - logged in  - accept limitations', () => {
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
     it('Should click on shop menu ', () => {
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
     it('Should go to service coverage page', () => {
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
     it('Should click on yes I accept the limitations', () => {
          PageObjects.PurchasedPhones.acceptLimitations();
     });
     it('Should click on the second box to make sure of the limiations', () => {
          PageObjects.PurchasedPhones.clickOnIunderstandCheckBox();
     });
     it('Should click on done btn', () => {
          PageObjects.PurchasedPhones.clickOnDoneBtn();
     });
     it('Should go to shipping page', () => {
          PageObjects.TitleExpectations.goToShippingPage();
     });
     it('Should the phone model,price, quantity from the order details', () => {
          cy.get('.phone-name').should('have.text', 'iPhone 12 64GB Red');
          cy.get('.head-desc > :nth-child(2)').should('have.text', '$620.00');
          cy.get('.phones-section > :nth-child(1) > .quantity').should('have.text', 'Quantity: 1');
     });
     it('should select shipping address successfully ',  () => {
          PageObjects.ShippingPage.selectShippingInfo();
     });
     it('Should click on continue shipping',  () => {
          PageObjects.ShippingPage.clickOnContinueShipping();
     });
     it('should select payment method successfully ',  () => {
          PageObjects.BillingPage.selectPaymentMethod();
      });
     it('Should click on continue button',  () => {
          PageObjects.BillingPage.clickOnContinueBilling();
     });
     it('Should go to place order page', () => {
          PageObjects.TitleExpectations.goToPlaceYourOrderPage();
     });
     it('Should click on Place your order button', () => {
          PageObjects.AccountSummary.clickOnPlaceYourOrder();
     });
     it('Should go to purchase successful page', () => {
          PageObjects.TitleExpectations.goToPurchaseSuccessfulPage();
     });
     it('Should click on Go to summary button', () => {
          PageObjects.AccountSummary.clickOnGoAccountToSummaryBtn();
     });
     it('Should go to account summary page', () => {
          PageObjects.TitleExpectations.goToAccountSummaryPageWithNoMDNS();
     });

});

