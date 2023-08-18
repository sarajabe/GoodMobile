import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Login with a user has no ACP plan - purchase an acp device', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login with a user has no ACP plan', () => {
        PageObjects.AccessControl.logInUserWithNoAcp();
    });
    it('purchase an acp device', () => {
        PageObjects.Acp.purchaseDeviceUserWithNoACPplan();
    });
})