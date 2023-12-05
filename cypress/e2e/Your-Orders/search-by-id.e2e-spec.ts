import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page, search by id multiple times and check that the result appears', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully', () => {
        PageObjects.AccessControl.successfulLogin();
    });
    it('Should click on your orders', () => {
        PageObjects.YouOrders.clickOnYourOrders();
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
        cy.get('[data-cy="orderId"]').should('have.text', 'Order ID: DD7XV6E8B8NVH4TO');
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
        cy.get('[data-cy="orderId"]').should('have.text', 'Order ID: DD7XV6E8B8NVH4TO');
    });
    it('Should check that unfiltered id do not exist', () => {
        cy.get('[data-cy="orderId"]').should('not.have.text', 'G7CZLX1QMCVOKPES');
    });
});
