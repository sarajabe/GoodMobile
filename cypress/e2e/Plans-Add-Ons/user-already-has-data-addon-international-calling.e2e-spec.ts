import { PageObjects } from '../../support/pageObjects'
describe('User already has data addon and international calling', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully with user has data addon and international calling', () => {
        PageObjects.AccessControl.accountAlreadyHasAddOnsOrder();
    });
    it('Should assert add-ons international calling to be disable', () => {
        PageObjects.PlanAddOns.assertUserHasDataAddOnsInternationalCalling();
    });
})