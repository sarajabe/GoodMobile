import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('ACP enrollment - no ACP app ID - required and invalid validation messages', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should signup a new acp user', () => {
        PageObjects.AccessControl.newUserAcp();
    });
    it('Should verify a new user with complete ACP status application', () => {
        PageObjects.Acp.enrollmentNewUserAcpRequiredInvalidValidation();
    });
});