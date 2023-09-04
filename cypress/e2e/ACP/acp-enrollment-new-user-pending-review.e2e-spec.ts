import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'
describe('Signup then enroll in ACP plan - new user - pending review - assert ACP summary', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should signup a new acp user', () => {
        PageObjects.AccessControl.newUserAcp();
    });
    it('Should enroll a new user acp pending review', () => {
        PageObjects.Acp.enrollmentNewUserAcpPendingReview();
    });
});