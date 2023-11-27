import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Signup then enroll in ACP plan - new user - yes flow - complete - pesron delivery', () => {
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
        PageObjects.Acp.enrollmentNewUserYesFlowAcpComplete();
    });
    it('Should purchase ACP plan with pesron delivery then activate', () =>{
        PageObjects.Acp.addNewLinePesronDeliveryActivateYesFlow()  
    });
});
