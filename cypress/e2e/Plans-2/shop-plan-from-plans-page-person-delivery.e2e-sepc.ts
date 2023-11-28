import { PageObjects } from '../../support/pageObjects'

describe('Shop new plan from plans page with person delivery', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully', () => {
        PageObjects.AccessControl.successfulLogin();
    });
    it('Should 2GB purchase plan with person delivery and assert the order detials', () => {
        PageObjects.PurchasedPlans.purchase2GBPlanWithPersonDeliveryExistingCustomerPlansPage();
    });
    it('Should 6GB purchase plan with person delivery and assert the order detials', () => {
        PageObjects.PurchasedPlans.purchase6GBPlanWithPersonDeliveryExistingCustomerPlansPage();
    });
    it('Should 15GB purchase plan with person delivery and assert the order detials', () => {
        PageObjects.PurchasedPlans.purchase15GBPlanWithPersonDeliveryExistingCustomerPlansPage();
    });
})