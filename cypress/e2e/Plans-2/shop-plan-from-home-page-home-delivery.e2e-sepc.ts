import { PageObjects } from '../../support/pageObjects'

describe('Shop new plan from home page with home delivery', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully', () => {
        PageObjects.AccessControl.successfulLogin();
    });
    it('Should 2GB purchase plan from home page with home delivery', () => {
        PageObjects.PurchasedPlans.purchase2GBPlanWithHomeDeliveryExistingCustomerHomePage();
    });
    it('Should assert purchased plan with home delivery', () => {
        PageObjects.PurchasedPlans.assertPurchased2GBPlanWithHomeDelivery();
    });
    it('Should 6GB purchase plan from home page with home delivery', () => {
        PageObjects.PurchasedPlans.purchase6GBPlanWithHomeDeliveryExistingCustomerHomePage();
    });
    it('Should assert purchased plan with home delivery', () => {
        PageObjects.PurchasedPlans.assertPurchased6GBPlanWithHomeDelivery();
    });
})