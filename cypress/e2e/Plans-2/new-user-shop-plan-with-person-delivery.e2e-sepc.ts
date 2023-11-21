import { PageObjects } from '../../support/pageObjects'

describe('New user - Shop new plan from plans page with person delivery', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should signUp successfully', () => {
        PageObjects.AccessControl.newUser();
    });
    it('Should 2GB purchase plan with person delivery and assert the order detials', () => {
        PageObjects.PurchasedPlans.purchase2GBPlanWithPersonDeliveryNewUser();
    });
})