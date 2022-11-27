import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page, filter the results based on canceled plans - check that Canceled status exists', () => {
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
    it('Should click on your orders', () => {
        PageObjects.YouOrders.clickOnYourOrders7thChild();
    });
    it('Should go to your orders page', () => {
        PageObjects.TitleExpectations.goToOrdersPage();
    });
    it('Should click on need help?', () => {
        PageObjects.YouOrders.clickOnFilter();
    });
    it('Should check cancel plan checkBox', () => {
        PageObjects.YouOrders.clickOnCancelledFilter();
    });
    it('Should click on apply btn', () => {
        PageObjects.YouOrders.clickOnApplyBtn();
    });
    it('Should show the filtered results', () => {
        PageObjects.TitleExpectations.goToOrdersPage();
    });
    it('Should make sure that Canceled status exists', () => {
        cy.get('[data-cy="status"]').first().should('have.text', 'Canceled');
    });
});
