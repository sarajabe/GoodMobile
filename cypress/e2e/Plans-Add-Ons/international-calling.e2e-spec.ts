import { PageObjects } from '../../support/pageObjects'
describe('Order International calling', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully', () => {
        PageObjects.AccessControl.successfulLogin();
    });
    it('Should Order International calling', () => {
        PageObjects.PlanAddOns.orderInternationalCalling();
    });
})