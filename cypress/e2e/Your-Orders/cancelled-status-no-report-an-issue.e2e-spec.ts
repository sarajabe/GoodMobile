import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in with an account that has a cancelled plan then go to your orders page and order details, report an issue shouldn`t exist ', () => {
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
    it('Should click on filter', () => {
        PageObjects.YouOrders.clickOnFilter();
    });
    it('Should check Canceled checkBox', () => {
        PageObjects.YouOrders.clickOnCancelledFilter();
    });
    it('Should click on apply btn', () => {
        PageObjects.YouOrders.clickOnApplyBtn();
    });
    it('Should make sure that Canceled status exists', () => {
        cy.get('[data-cy="status"]').first().should('have.text', CONSTANT.ORDER_STATUS.CANCELED);
    });
    it('Should click on order details', () => {
        PageObjects.YouOrders.clickOn2ndViewOrderDetails();
    });
    it('Should go to order details page', () => {
        PageObjects.TitleExpectations.goToOrderDetailsPage();
    });
    it('Should check that the order status is cancelled', () => {
        cy.get('[data-cy="orderStatus"]').should('have.text', 'Canceled');
        cy.get('[data-cy="reportAnIssue"]').should('not.exist');
    });
    it('Should check that the report an issue option does not exist since the order is cancelled', () => {
        cy.get('[data-cy="reportAnIssue"]').should('not.exist');
    });
});
