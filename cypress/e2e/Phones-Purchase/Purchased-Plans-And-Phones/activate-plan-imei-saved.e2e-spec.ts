import { PageObjects } from '../../../support/pageObjects'
import { CONSTANT } from '../../../fixtures/constants'

describe('activate plan - saved imei', () => {
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
    it('Should click on activate plan btn', () => {
        PageObjects.PurchasedPlans.clickOnActivatePlanButton();
    });
    it('Should go to activate | port your number page', () => {
        PageObjects.TitleExpectations.goToActivatePortYouSimPage();
    });
    it('Should click on activate with a new number', () => {
        PageObjects.Activation.clickOnActivateWithNewNumberButton();
    });
    it('Should fill in activation info', () => {
        PageObjects.Activation.enteractivationInfoForNewNumber(CONSTANT.ACTIVATION.ACTIVATION_DATA.NEW_NUMBER.ACTIVATION_CODE,
            CONSTANT.ACTIVATION.ACTIVATION_DATA.NEW_NUMBER.ACCOUNT_PIN,
            CONSTANT.ACTIVATION.ACTIVATION_DATA.NEW_NUMBER.CONFIRM_ACCOUNT_PIN);
    });
    it('Should check the recaptcha', () => {
        PageObjects.Recaptcha.checkRecaptchaCustomerInfo();
    });
    it('Shoul check that the activation btn is enabled', () => {
        cy.get('[data-cy="activate-button"]').should('not.be.disabled');

    });
});

