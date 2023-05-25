import { PageObjects } from '../../support/pageObjects'
describe('Order data Add-ons', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully', () => {
        PageObjects.AccessControl.successfulLogin();
    });
    it('Should Order data Add-ons', () => {
        PageObjects.PlanAddOns.orderDataAddOns();
    });
})