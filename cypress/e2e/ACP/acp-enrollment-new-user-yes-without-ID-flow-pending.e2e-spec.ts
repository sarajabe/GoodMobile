import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'
describe('Signup then enroll in ACP plan - new user - yes without ID flow - pending ', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should signup a new acp user', () => {
        PageObjects.AccessControl.newUserAcp();
    });
    it('Should verify a new user with pending ACP status application', () => {
        PageObjects.Acp.enrollmentNewUserYesWithoutIdFlowAcpPending();
    });
})