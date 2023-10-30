import { PageObjects } from '../../support/pageObjects'
describe('User already has one data add ons', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully with user has one data add ons', () => {
        PageObjects.AccessControl.accountAlreadyHasAddOnsOneOrder();
    });
    it('Should assert a user has one data add ons', () => {
        PageObjects.PlanAddOns.assertUserHasOneDataAddOns();
    });
})