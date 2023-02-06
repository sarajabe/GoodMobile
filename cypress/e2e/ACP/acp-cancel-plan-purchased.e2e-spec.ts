import { PageObjects } from '../../support/pageObjects'

describe('ACP plan purchase with store pickup ', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should go throw the a successful login', () => {
        PageObjects.AccessControl.successfulLogin();
    });
    it('Should cancle purchased ACP plan', () => {
        PageObjects.Acp.cancelPurchasePlan();
    });
})