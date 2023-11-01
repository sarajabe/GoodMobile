import { PageObjects } from '../../support/pageObjects'
describe('Order data Add-ons and international calling then delete', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully with user do not have add-ons order', () => {
        PageObjects.AccessControl.noAddOnsOrderAccount();
    });
    it('Should purchase data Add-ons and international calling then delete', () => {
        PageObjects.PlanAddOns.purchaseDataAddOnsInternationalCallingDeleteIt();
    });
})