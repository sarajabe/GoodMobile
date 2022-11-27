import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Select an ACP plan then Sign in with account that already purchased ACP plan - check plan btn', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should click on shop menu to click on plans', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should click on plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should click on learn more btn', () => {
        PageObjects.Acp.clickOnLearnMoreBtn();
    });
    it('Should go to ACP page', () => {
        PageObjects.TitleExpectations.goToACPPage();
    });
    it('Should click on apply now button', () => {
        PageObjects.Acp.clickOnApplyNowBtn();
    });
    it('Should go to ACP sign up page', () => {
        PageObjects.TitleExpectations.goToACPSignUpPage();
    });
    it('Should click on Sign in link', () => {
        PageObjects.Acp.clickOnSignInLink();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it('Should fill login info with valid data', () => {
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.VERIFIED.EMAIL, CONSTANT.ACCESS.VERIFIED.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on shop menu to click on plans', () => {
        PageObjects.HomePage.clickOnShopMenu();
    });
    it('Should click on plans', () => {
        PageObjects.HomePage.clickOnPlans();
    });
    it('Should go to plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
    it('Should be able to see 1/1 purchased as text for the button', () => {
        cy.get('[data-cy="check-qualification"]').should('have.text', '1/1 purchased ');
    });
    it('Should click on learn more btn', () => {
        PageObjects.Acp.clickOnLearnMoreBtn();
    });
    it('Should click on got it btn from pop up', () => {
        PageObjects.Acp.clickOnGotItBtnFromPopUp();
    });
    it('Should stay in plans page', () => {
        PageObjects.TitleExpectations.goToPlansG2GPage();
    });
});