import { PageObjects } from '../../support/pageObjects'

describe('Shop new plan from home page with person delivery', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully', () => {
        PageObjects.AccessControl.successfulLogin();
    });
    it('Should 2GB purchase plan from home page with person delivery', () => {
        PageObjects.PurchasedPlans.purchase2GBPlanWithPersonDeliveryExistingCustomerHomePage();
    });
    it('Should 6GB purchase plan from home page with person delivery', () => {
        PageObjects.PurchasedPlans.purchase6GBPlanWithPersonDeliveryExistingCustomerHomePage();
    });
})