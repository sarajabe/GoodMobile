import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then enroll in ACP plan - new user - pending resolution - logout - resign in - add new line and activate - home delivery', () => {
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
        PageObjects.Acp.enrollmentNewUserAcpComplete();
    });
    it('Should logout from the account', () => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should resign in', () => {
        PageObjects.AccessControl.successfulLoginNewUserAcp();
    }); 
    it('Should Should purchase ACP plan with home delivery then activate', () => {
        PageObjects.Acp.addNewLineHomeDeliveryActivateExistingUser();
    });  
})