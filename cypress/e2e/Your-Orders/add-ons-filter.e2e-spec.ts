import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page, filter the results based on add ons - check that there is no shipping address & cancel plan', () => {
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
    it('Should fill in start and end date', () => {
        PageObjects.YouOrders.fillInDate();
    });
    it('Should check addOns checkBox', () => {
        PageObjects.YouOrders.clickOnAddOnsFilter();
    });
    it('Should click on apply btn', () => {
        PageObjects.YouOrders.clickOnApplyBtn();
    });
    it('Should show the filtered results', () => {
        PageObjects.TitleExpectations.goToOrdersPage();
    });
    it('Should make sure that Purchased status exists', () => {
        cy.get('[data-cy="status"]').first().should('have.text', CONSTANT.ORDER_STATUS.PURCHASED);
    });
    it('Should click on order details', () => {
        PageObjects.YouOrders.clickOnOrderDetails();
    });
    it('Should go to your order details page', () => {
        PageObjects.TitleExpectations.goToOrderDetailsPage();
    });
    it('Should make sure that there is no shipping address for the add ons order', () => {
        cy.get('[data-cy="shippingAddress"]').should('not.exist');
    });
    it('Should make sure that there is no cancel in the order details', () => {
        cy.get('[data-cy="cancel"]').should('not.exist');
    });
});
