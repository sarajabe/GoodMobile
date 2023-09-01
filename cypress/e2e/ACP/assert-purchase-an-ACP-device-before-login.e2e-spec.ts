import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'
describe('Select an ACP device before login', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    it('Should select an ACP device before login - login page', () => {
        PageObjects.Acp.selectAcpDeviceWithoutLogingIn();
    });
})