import { PageObjects } from '../../support/pageObjects'
describe('User already has multiple data add ons', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully with user has multiple data add ons', () => {
        PageObjects.AccessControl.accountAlreadyHasAddOnsMultipleOrder();
    });
    it('Should assert a user has multiple data add ons', () => {
        PageObjects.PlanAddOns.assertUserHasMultipleDataAddOns();
    });
})