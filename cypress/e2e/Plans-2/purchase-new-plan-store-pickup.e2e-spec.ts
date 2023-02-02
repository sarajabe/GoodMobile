import { PageObjects } from '../../support/pageObjects'

describe('Shop new plan with store pickup', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should go throw the a successful login', () => {
        PageObjects.AccessControl.successfulLogin();
    });
    it('Should purchase plan with store pickup', () => {
       PageObjects.PurchasedPlans.purchasePlanWithStorePickupExistingCustomer();
    });
})