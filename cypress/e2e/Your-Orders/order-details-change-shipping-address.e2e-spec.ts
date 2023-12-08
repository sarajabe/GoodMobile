import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page,then the order details page to edit the shipping address', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully', () => {
        PageObjects.AccessControl.successfulLogin();
    });
    it('Should 2GB purchase plan with home delivery', () => {
        PageObjects.PurchasedPlans.purchase2GBPlanWithHomeDeliveryExistingCustomerPlansPage();
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
    it('Should checkte pending checkBox', () => {
        PageObjects.YouOrders.clickOnPendingCheckBox();
    });
    it('Should click on apply btn', () => {
        PageObjects.YouOrders.clickOnApplyBtn();
    });
    it('Should make sure that Pending status exists', () => {
        cy.get('[data-cy="status"]').first().should('have.text',CONSTANT.ORDER_STATUS.PENDING);
    });
    it('Should click on order details', () => {
        PageObjects.YouOrders.clickOnOrderDetails();
    });
    it('Should go to order details page', () => {
        PageObjects.TitleExpectations.goToOrderDetailsPage();
    });
    it('Should click on change to change the shipping address', () => {
        PageObjects.YouOrders.clickOnChangeAddress();
    });
    it('Should fill in the new shipping address', () => {
        PageObjects.YouOrders.editShippingAddress(CONSTANT.SHIPPING.VALID.NAME,
            CONSTANT.SHIPPING.VALID.ADDRESS,
            CONSTANT.SHIPPING.VALID.CITY,
            CONSTANT.SHIPPING.VALID.STATE,
            CONSTANT.SHIPPING.VALID.POSTAL);
        cy.get('[data-cy="suiteNo"]').click();
    });
    it('Should click on save btn', () => {
        PageObjects.YouOrders.clickOnSave();
    });
    it('Should click on use verified address', () => {
        PageObjects.PurchasedPlans.clickOnUseVerifiedAddress();
    });
    it('Should go back to order details page', () => {
        PageObjects.TitleExpectations.goToOrderDetailsPage();
    });
    it('Should assert the shipping address', () => {
        cy.get('[data-cy="shippingAddressName"]').should('have.text','Maroon Haddad, 12300 BERMUDA RD24');
        cy.get('[data-cy="shippingAddressInfo"]').should('have.text','NV, 89044-8706 HENDERSON');
    });
});
