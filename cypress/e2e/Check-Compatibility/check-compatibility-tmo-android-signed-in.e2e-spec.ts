import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('sign in then check compatibility', () => {
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
    it('Should click on bring your phone', () => {
        PageObjects.HomePage.clickOnBringYourPhone();
    });
    it('Should go to check compatibility page', () => {
        PageObjects.TitleExpectations.goToBringYourPhonePage();
    });
    it('Should click on get started button', () => {
        PageObjects.HomePage.clickOnGetStarted();
    });
    it('Should go to check compatibility page tmo - android', () => {
        PageObjects.TitleExpectations.goToCheckCompatibilityPage();
    });
    it('Should enter the IME number and address reference', () => {
        PageObjects.Compatibility.enterIMEInumber(CONSTANT.COMPATIBILITY.IMEIS.IMEI_ATT);
        PageObjects.Compatibility.enterAddressRef();
        cy.get('[data-cy=equipmentNumber]').click();
    });
    it('Should check recaptcha', () => {
        PageObjects.Recaptcha.invisibleRecaptcha();
    });
    it('Should click on check phone button', () => {
        PageObjects.Compatibility.clickOnCheckPhoneButton();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL2);
    });
    it('Should click on continue button in pop up window', () => {
        PageObjects.HomePage.clickOnContinue();
    });
    it('Should go to g2go plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should add 2gb plan to cart', () => {
        PageObjects.Plans.clickOnPlan_2_GB_Plans_Page();
    });
    it('Should go to shipping page', () => {
        PageObjects.TitleExpectations.goToShippingPage();
    });
    it('should select shipping address successfully ', () => {
        PageObjects.ShippingPage.selectShippingInfo();
    });
    it('Should click on continue shipping', () => {
        PageObjects.ShippingPage.clickOnContinueShipping();
    });
    it('should select payment method successfully ', () => {
        PageObjects.BillingPage.selectPaymentMethod();
    });
    it('Should click on continue button', () => {
        PageObjects.BillingPage.clickOnContinueBilling();
    });
    it('Should go to place order page', () => {
        PageObjects.TitleExpectations.goToPlaceYourOrderPage();
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL3);
    });
    it('Should click on remove to remove the plan', () => {
        PageObjects.AccountSummary.removePlan2thChild();
    });
    it('Should click on yes button to agree remove the plan', () => {
        PageObjects.AccountSummary.clickOnYesClearCart();
    });
    it('Should go back to home page', () => {
        PageObjects.TitleExpectations.goToHomePage();
    });
});
