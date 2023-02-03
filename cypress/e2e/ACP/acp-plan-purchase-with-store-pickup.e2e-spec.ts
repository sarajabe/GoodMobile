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
    it('Should purchase ACP plan with store pickup', () => {
        PageObjects.Acp.purchasePlanWithStorePickup();
    });
})