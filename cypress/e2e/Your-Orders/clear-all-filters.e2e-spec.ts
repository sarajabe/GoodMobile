import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page, select all filters and apply it, then clear all filters and make sure that the clear filter is applied on all types of filters', () => {
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
    it('Should check Canceled checkBox', () => {
        PageObjects.YouOrders.clickOnCancelledFilter();
    });
    it('Should check pending checkBox', () => {
        PageObjects.YouOrders.clickOnPendingCheckBox();
    });
    it('Should check delivered checkBox', () => {
        PageObjects.YouOrders.clickOnDeliveredCheckBox();
    });
    it('Should check shipped checkBox', () => {
        PageObjects.YouOrders.clickOnShippedFilter();
    });
    it('Should check add-on checkBox', () => {
        PageObjects.YouOrders.clickOnAddOnsFilter();
    });
    it('Should check change plan checkBox', () => {
        PageObjects.YouOrders.clickOnChangePlanFilter();
    });
    it('Should click on purchased filter', () => {
        PageObjects.YouOrders.clickOnPurchasedFilter();
    });
    it('Should click on vioded filter', () => {
        PageObjects.YouOrders.clickOnVoided();
    });
    it('Should check new plan checkBox', () => {
        PageObjects.YouOrders.clickOnNewPlanFilter();
    });
    it('Should check refill checkBox', () => {
        PageObjects.YouOrders.clickOnRefillFilter();
    });
    it('Should check replacement sim checkBox', () => {
        PageObjects.YouOrders.clickOnReplacementSimFilter();
    });
    it('Should click on order details btn', () => {
        PageObjects.YouOrders.clickOnApplyBtn();
    });
    it('Should go to your order details page', () => {
        PageObjects.TitleExpectations.goToOrdersPage();
    });
    it('Should click on filter', () => {
        PageObjects.YouOrders.clickOnFilter();
    });
    it('Should click on clear all', () => {
        PageObjects.YouOrders.clickOnClearFilters();
    });
    it('Should go to your order details page', () => {
        PageObjects.TitleExpectations.goToOrdersPage();
    });
    it('Should click on filter to check that all checkboxes are unchecked', () => {
        PageObjects.YouOrders.clickOnFilter();
    });
    it('Should check that all checkboxes are unchecked and the filled date is empty', () => {
        cy.get('[value="CANCELED"]').should('not.be.checked');
        cy.get('[value="DELIVERED"]').should('not.be.checked');
        cy.get('[value="PENDING"]').should('not.be.checked');
        cy.get('[value="SVC_PURCHASED"]').should('not.be.checked');
        cy.get('[value="SHIPPED"]').should('not.be.checked');
        cy.get('[value="VOIDED"]').should('not.be.checked');
        cy.get('[value="addon"]').should('not.be.checked');
        cy.get('[value="change_plan"]').should('not.be.checked');
        cy.get('[value="new"]').should('not.be.checked');
        cy.get('[value="refill"]').should('not.be.checked');
        cy.get('[value="replacement_sim"]').should('not.be.checked');
        cy.get('[data-cy="startDate"]').should('have.text', '');
        cy.get('[data-cy="endDate"]').should('have.text', '');
    });
});
