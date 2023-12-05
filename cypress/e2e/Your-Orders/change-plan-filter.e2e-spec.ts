import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page, filter the results based on changed plans - check that there is no shipping address & cancel plan', () => {
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
    it('Should check the change plan checkBox', () => {
        PageObjects.YouOrders.clickOnChangePlanFilter();
    });
    it('Should click on apply btn', () => {
        PageObjects.YouOrders.clickOnApplyBtn();
    });
    it('Should show the filtered results', () => {
        PageObjects.TitleExpectations.goToOrdersPage();
    });
    it('Should click on order details btn', () => {
        PageObjects.YouOrders.clickOnOrderDetails();
    });
    it('Should go to your order details page', () => {
        PageObjects.TitleExpectations.goToOrderDetailsPage();
    });
    it('Should make sure that there is no shipping address', () => {
        cy.get('[data-cy="shippingAddress"]').should('not.exist');
    });
    it('Should make sure that there is no cancel in the order details', () => {
        cy.get('[data-cy="cancel"]').should('not.exist');
    });
});
