import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page, filter the results based on date and pending plans', () => {
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
    it('Should checkte pending checkBox', () => {
        PageObjects.YouOrders.clickOnPendingCheckBox();
    });
    it('Should click on apply btn', () => {
        PageObjects.YouOrders.clickOnApplyBtn();
    });
    it('Should show the filtered results', () => {
        PageObjects.TitleExpectations.goToOrdersPage();
    });
    it('Should make sure that Pending status exists', () => {
        cy.get('[data-cy="status"]').first().should('have.text', CONSTANT.ORDER_STATUS.PENDING);
    });
});
