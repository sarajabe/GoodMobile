import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page, search by id multiple times and check that the result appears', () => {
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
    it('Should search by id', () => {
        PageObjects.YouOrders.searchByID();
    });
    it('Should click on search btn', () => {
        PageObjects.YouOrders.clickOnSearchBtn();
    });
    it('Should show the filtered results', () => {
        PageObjects.TitleExpectations.goToOrdersPage();
    });
    it('Should check that the same order id exists', () => {
        cy.get('[data-cy="orderId"]').should('have.text', 'Order ID: 2F7NBTSQH1KPZS92');
    });
    //search by id for the second time to make sure that it's consistent and works as many times as we want
    // also make sure that non filtered ids don't exist
    it('Should search by id', () => {
        PageObjects.YouOrders.searchByID();
    });
    it('Should click on search btn', () => {
        PageObjects.YouOrders.clickOnSearchBtn();
    });
    it('Should show the filtered results', () => {
        PageObjects.TitleExpectations.goToOrdersPage();
    });
    it('Should check that the same order id exists', () => {
        cy.get('[data-cy="orderId"]').should('have.text', 'Order ID: 2F7NBTSQH1KPZS92');
    });
    it('Should wait', () => {
        cy.wait(CONSTANT.TIME.SPEED_TIME.LEVEL4);
    });
    it('Should check that the same order id exists', () => {
        cy.get('[data-cy="orderId"]').should('have.text', 'Order ID: 2F7NBTSQH1KPZS92');
    });
    it('Should check that unfiltered id do not exist', () => {
        cy.get('[data-cy="orderId"]').should('not.have.text', 'G7CZLX1QMCVOKPES');
    });
});
