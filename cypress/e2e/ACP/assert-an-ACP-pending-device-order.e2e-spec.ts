import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'
describe('Login with a user has pending ACP device - purchase an acp device', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login with a user has pending ACP device', () => {
        PageObjects.AccessControl.logInUserWithPendingACPdevice();
    });
    it('purchase an acp device', () => {
        PageObjects.Acp.purchaseDeviceUserWithPendingACPdevice();
    });
})