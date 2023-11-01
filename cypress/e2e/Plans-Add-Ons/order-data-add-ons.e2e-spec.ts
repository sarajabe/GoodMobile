import { PageObjects } from '../../support/pageObjects'
describe('Order data Add-ons then delete from place order', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully with user do not have add-ons order', () => {
        PageObjects.AccessControl.noAddOnsOrderAccount();
    });
    it('Should Order data Add-ons and Delete it', () => {
        PageObjects.PlanAddOns.orderDataAddOnsDeleteIt();
    });
})