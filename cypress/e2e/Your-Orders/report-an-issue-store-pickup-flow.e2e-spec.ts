import { PageObjects } from '../../support/pageObjects'
describe('Shop new plan with store pickup', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully', () => {
        PageObjects.AccessControl.successfulLogin();
    });
    it('Should purchase plan with store pickup', () => {
        PageObjects.PurchasedPlans.purchasePlanWithStorePickupExistingCustomer();
    });
    it('Should go throw report an issue store pickup flow', () => {
       PageObjects.YouOrders.reportIssueStorePickupFlow();
    });
})