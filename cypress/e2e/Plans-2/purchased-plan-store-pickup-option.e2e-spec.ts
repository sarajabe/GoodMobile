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
    it('Should assert purchased plan with store pickup', () => {
       PageObjects.PurchasedPlans.assertPurchasedPlanWithStorePickupExistingCustomer();
    });
})
