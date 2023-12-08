import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page,report an issue, check that the return device , update shipping address and order not received are disabled ', () => {
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
    it('Should click on purchased filter', () => {
        PageObjects.YouOrders.clickOnPurchasedFilter();
    });
    it('Should click on apply btn', () => {
        PageObjects.YouOrders.clickOnApplyBtn();
    });
    it('Should show the filtered results', () => {
        PageObjects.TitleExpectations.goToOrdersPage();
    });
    it('Should make sure that Purchased status exists', () => {
        cy.get('[data-cy="status"]').first().should('have.text',CONSTANT.ORDER_STATUS.PURCHASED);
    });
    it('Should click on order details', () => {
        PageObjects.YouOrders.clickOnOrderDetails();
    });
    it('Should go to order details page', () => {
        PageObjects.TitleExpectations.goToOrderDetailsPage();
    });
    it('Should click on report an issue', () => {
        PageObjects.YouOrders.clickOnReportAnIssue();
    });
    it('Should go to report an issue page', () => {
        PageObjects.TitleExpectations.goToReportAnIssuePage();
    });
    it('Should check that the order not received is disabled', () => {
        cy.get('.options-container > :nth-child(1)').should('have.class', 'disabled');
    });
    it('Should check that the update shipping address is disabled', () => {
        cy.get('.options-container > :nth-child(3)').should('have.class', 'disabled');
    });
    it('Should stay in report an issue page', () => {
        PageObjects.TitleExpectations.goToReportAnIssuePage();
    });
});
