import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Signup then enroll in ACP plan - new user - complete - home delivery', () => {
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
    it('Should purchase ACP plan with home delivery then activate', () =>{
        PageObjects.Acp.addNewLineHomeDeliveryActivate(); 
    });
});
