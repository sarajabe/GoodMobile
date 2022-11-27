import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page, select all filters and apply it, then clear all filters and make sure that the clear filter is applied on all types of filters', () => {
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
        PageObjects.YouOrders.clickOnChangePlanCheckBox();
    });
    it('Should check migration checkBox', () => {
        PageObjects.YouOrders.clickOnMigrationFilter();
    });
    it('Should check new phone checkBox', () => {
        PageObjects.YouOrders.clickOnNewPhoneFilter();
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
        cy.get(':nth-child(6) > .filter-label > input').should('not.be.checked');
        cy.get(':nth-child(4) > .filter-form > :nth-child(2) > .filter-label > input').should('not.be.checked');
        cy.get(':nth-child(4) > .filter-form > :nth-child(1) > .filter-label > input').should('not.be.checked');
        cy.get(':nth-child(4) > .filter-form > :nth-child(1) > .filter-label > input').should('not.be.checked');
        cy.get(':nth-child(3) > .filter-form > :nth-child(1) > .filter-label > input').should('not.be.checked');
        cy.get(':nth-child(3) > .filter-form > :nth-child(3) > .filter-label > input').should('not.be.checked');
        cy.get(':nth-child(3) > .filter-form > :nth-child(2) > .filter-label > input').should('not.be.checked');
        cy.get(':nth-child(4) > .filter-form > :nth-child(2) > .filter-label > input').should('not.be.checked');
        cy.get(':nth-child(3) > .filter-form > :nth-child(4) > .filter-label > input').should('not.be.checked');
        cy.get(':nth-child(3) > .filter-form > :nth-child(5) > .filter-label > input').should('not.be.checked');
        cy.get(':nth-child(4) > .filter-form > :nth-child(3) > .filter-label > input').should('not.be.checked');
        cy.get(':nth-child(4) > .filter-form > :nth-child(4) > .filter-label > input').should('not.be.checked');
        cy.get(':nth-child(4) > .filter-form > :nth-child(5) > .filter-label > input').should('not.be.checked');
        cy.get(':nth-child(7) > .filter-label > input').should('not.be.checked');
        cy.get('[data-cy="startDate"]').should('have.text', '');
        cy.get('[data-cy="endDate"]').should('have.text', '');
    });
});
