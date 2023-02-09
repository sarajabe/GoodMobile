import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page, view invoice', () => {
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
    it('Should assert store pickup invoice', () => {
        PageObjects.YouOrders.storePickupInvoice();
    });
});