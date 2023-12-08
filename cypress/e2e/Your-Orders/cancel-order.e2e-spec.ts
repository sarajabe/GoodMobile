import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page,to cancel an order', () => {
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
    it('Should check pending checkBox', () => {
        PageObjects.YouOrders.clickOnPendingCheckBox();
    });
    it('Should click on apply btn', () => {
        PageObjects.YouOrders.clickOnApplyBtn();
    });
    it('Should make sure that Pending status exists', () => {
        cy.get('[data-cy="status"]').first().should('have.text',CONSTANT.ORDER_STATUS.PENDING);
    });
    it('Should click order details', () => {
        PageObjects.YouOrders.clickOnOrderDetails();
    });
    it('Should go to order details page', () => {
        PageObjects.TitleExpectations.goToOrderDetailsPage();
    });
    it('Should click on cancel btn', () => {
        PageObjects.YouOrders.clickOnCancelPlan();
    });
    it('Should click on no from the pop up', () => {
        PageObjects.YouOrders.clickOnNoBtnFromCancelOrderPopUp();
    });
    it('Should go back to order details page', () => {
        PageObjects.TitleExpectations.goToOrderDetailsPage();
    });
});
