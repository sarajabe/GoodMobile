import { PageObjects } from '../../../support/pageObjects'
import { CONSTANT } from '../../../fixtures/constants'

describe('edit shipping address from purchased plans page - phone purchased', () => {
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
     it('Should click on purchased plans ', () => {
          PageObjects.AccountSummary.clickOnPurchasedPlans();
     });
     it('Should go to purchased plans page', () => {
          PageObjects.TitleExpectations.goToPurchasedPlansPage();
     });
     it('Should click on edit shipping address icon ', () => {
          PageObjects.PurchasedPlans.clickOnEditShippingAddressIcon();
     });
     it('Should edit shipping address ', () => {
          PageObjects.PurchasedPlans.editShippingInfo(CONSTANT.SHIPPING.SHIPPING_DATA.NAME,
               CONSTANT.SHIPPING.SHIPPING_DATA.SHIPPING_ADDRESS,
               CONSTANT.SHIPPING.SHIPPING_DATA.SUITE_NO,
               CONSTANT.SHIPPING.SHIPPING_DATA.CITY,
               CONSTANT.SHIPPING.SHIPPING_DATA.STATE,
               CONSTANT.SHIPPING.SHIPPING_DATA.POSTAL);
     });
     it('Should click on save btn', () => {
          PageObjects.PurchasedPlans.clickOnSaveBtn();
     });
     it('Should click on use verified address', () => {
          PageObjects.PurchasedPlans.clickOnUseVerifiedAddress();
     });
     it('Should go back to purchased plans page', () => {
          PageObjects.TitleExpectations.goToPurchasedPlansPage();
     });

});

