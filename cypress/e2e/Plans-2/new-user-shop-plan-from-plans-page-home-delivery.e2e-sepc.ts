import { PageObjects } from '../../support/pageObjects'

describe('SignUp -  Shop new plan from plans page with home delivery', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should signUp successfully', () => {
        PageObjects.AccessControl.newUser();
    });
    it('Should 2GB purchase plan for new user with home delivery', () => {
        PageObjects.PurchasedPlans.purchase2GBPlanWithHomeDeliveryNewUser();
    });
    it('Should assert purchased 2GB plan with home delivery', () => {
        PageObjects.PurchasedPlans.assertPurchased2GBPlanWithHomeDelivery();
    });
})