import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then enroll in ACP plan - pending - select exisiting line - change plan - cancel application', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    // after(() => {
    //     PageObjects.AccessControl.logoutFromAccount();
    // });
    it('Should sign in with user that have existing line', () => {
        PageObjects.AccessControl.successfulLoginExisingUserWithMdn();
    });
    it('Should verify a existing user with complete ACP status application', () => {
        PageObjects.Acp.enrollmentExistingUserAcpComplete();
    });
    it('Should select Existing line', () => {
        PageObjects.Acp.selectExistingLineForAcpApp();
    }); 
    
    //change the plan
    PageObjects.AccountSummary.changePlanFromAcpTo2GbPlan();

    //cancel ACP
    
})