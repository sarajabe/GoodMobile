import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in, visit the provided url, go to coverage page then purchase a plan', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.UTM_ACCOUNT.EMAIL, CONSTANT.ACCESS.UTM_ACCOUNT.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary ', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should visit the provided link', () => {
        cy.visit('http:localhost:4000/?utm_source=fsi&utm_campaign=fsi-demo&utm_medium=affiliate&agentid=123466');
    });
    // Here we will do some extra specs like visiting the coveragepage
    // In order to make sure that we still have UTM codes even though after doing some other processes
    it('Should click on coverage in header', () => {
        PageObjects.HomePage.clickOnCoverage();
    });
    it('Should go to Good2Go Coverage page', () => {
        PageObjects.TitleExpectations.goToGood2GoCoveragePage();
    });
    it('Should click on shop menu ', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should  click on purchase new plan plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should select plan if card is empty ', () => {
        PageObjects.Plans.clickOnPlan_1_GB();
    });
    it('Should click on i already have a phone', () => {
        PageObjects.PurchasedPhones.clickOnIAlreadyHaveAphone();
    });
    it('Should go check compatibility page', () => {
        PageObjects.TitleExpectations.goToCheckYourPhoneCompatibilityPage();
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
    });
    it('Should go  compatibility result page', () => {
        PageObjects.TitleExpectations.goToCompatabilityResultPage();
    });
    it('Should click on proceed to checkout button', () => {
        PageObjects.Compatibility.clickOnProceedToCheckoutBtn();
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
    it('Should go to purchase successful page', () => {
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
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
});
