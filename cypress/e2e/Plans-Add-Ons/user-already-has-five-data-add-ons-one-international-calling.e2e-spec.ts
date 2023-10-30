import { PageObjects } from '../../support/pageObjects'
describe('User already has 5 data add ons and one international calling', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully with user has 5 data add ons and one international calling', () => {
        PageObjects.AccessControl.accountAlreadyHasAddOns5OrderOneInternationalCalling();
    });
    it('Should assert a user has 5 data add ons and one international calling', () => {
        PageObjects.PlanAddOns.assertUserHas5OrderOneInternationalCalling();
    });
})