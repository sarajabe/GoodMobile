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
    it('Should assert store pickup option in orders page', () => {
       PageObjects.YouOrders.ordersPageStorePickupOption();
    });
})