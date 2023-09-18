import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'
describe('Signup then enroll in ACP plan - new user - in progress - assert ACP summary', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccountAfterBeingInACPApp();
    });
    it('Should signup a new acp user', () => {
        PageObjects.AccessControl.newUserAcp();
    });
    it('Should enroll a new user acp in progress', () => {
        PageObjects.Acp.enrollmentNewUserAcpInProgress();
    });
});