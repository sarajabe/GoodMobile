import { PageObjects } from '../../support/pageObjects'
describe('User already has cancelled mdn assert addon behavior', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully with user has cancelled mdn', () => {
        PageObjects.AccessControl.accountHasCanceledMdn();
    });
    it('Should assert addon behavior when the mdn is cancelled', () => {
        PageObjects.PlanAddOns.assertAddonBehaviorMdnCancelled();
    });
})