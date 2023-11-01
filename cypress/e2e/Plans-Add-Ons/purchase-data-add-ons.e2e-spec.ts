import { PageObjects } from '../../support/pageObjects'
describe('Purchase data Add-ons', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully', () => {
        PageObjects.AccessControl.successfulLogin();
    });
    it('Should purchase data Add-ons', () => {
        PageObjects.PlanAddOns.purchaseDataAddOns();
    });
    it('Should assert the add-ons order', () => {
        PageObjects.YouOrders.ordersDetailsPagePlanAddOns();
    });
})