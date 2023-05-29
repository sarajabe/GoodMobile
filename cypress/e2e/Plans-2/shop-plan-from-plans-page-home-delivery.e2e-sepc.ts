import { PageObjects } from '../../support/pageObjects'

describe('Shop new plan from plans page with home delivery', () => {
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
    it('Should assert purchased 2GB plan with home delivery', () => {
        PageObjects.PurchasedPlans.assertPurchased2GBPlanWithHomeDelivery();
    });
    it('Should 6GB purchase plan with home delivery', () => {
        PageObjects.PurchasedPlans.purchase6GBPlanWithHomeDeliveryExistingCustomerPlansPage();
    });
    it('Should assert purchased 6GB plan with home delivery', () => {
        PageObjects.PurchasedPlans.assertPurchased6GBPlanWithHomeDelivery();
    });
    it('Should 15GB purchase plan with home delivery', () => {
        PageObjects.PurchasedPlans.purchase15GBPlanWithHomeDeliveryExistingCustomerPlansPage();
    });
    it('Should assert purchased 15GB plan with home delivery', () => {
        PageObjects.PurchasedPlans.assertPurchased15GBPlanWithHomeDelivery();
    });
})