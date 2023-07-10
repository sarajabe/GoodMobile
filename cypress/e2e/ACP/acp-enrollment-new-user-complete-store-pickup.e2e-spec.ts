import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then enroll in ACP plan - new user - complete - store pickup', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should signup a new acp user', () => {
        PageObjects.AccessControl.newUserAcp();
    });
    it('Should enroll a new user acp complete', () => {
        PageObjects.Acp.enrollmentNewUserAcpComplete();
    });
    it('Should add new line with store pickup then activate', () =>{
        PageObjects.Acp.addNewLineStorePickupActivate()  
    });
});
