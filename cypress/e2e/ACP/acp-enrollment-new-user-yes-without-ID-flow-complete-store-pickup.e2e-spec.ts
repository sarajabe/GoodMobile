import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'
describe('Signup then enroll in ACP plan - new user - yes without ID flow - complete - store pickup', () => {
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
        PageObjects.Acp.enrollmentNewUserYesWithoutIDFlowAcpComplete();
    });
    it('Should purchase ACP plan with store pickup then activate', () =>{
        PageObjects.Acp.addNewLineStorePickupActivateYesWithoutIDFlow();  
    });
});