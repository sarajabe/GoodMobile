import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'
describe('Login with a user has shipped ACP device - purchase an acp device', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login with a user has shipped ACP device', () => {
        PageObjects.AccessControl.logInUserWithShippedACPdevice();
    });
    it('purchase an acp device', () => {
        PageObjects.Acp.purchaseDeviceUserWithShippedACPdevice();
    });
})