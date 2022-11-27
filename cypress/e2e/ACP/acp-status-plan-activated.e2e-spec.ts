import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to acp application page - acp initials approval status must be complete - ACP benefit must be Enrolled- go to cancel plan page', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should click on sign in', () => {
        PageObjects.HomePage.clickOnSignIn();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it('Should fill login info with valid data - user with active acp plan', () => {
        PageObjects.AccessControl.logIn(CONSTANT.ACP_DATA.ACTIVE_PLAN.EMAIL, CONSTANT.ACP_DATA.ACTIVE_PLAN.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on ACP application', () => {
        PageObjects.AccountSummary.clickOnACPApplication();
    });
    it('Should go to acp status page', () => {
        PageObjects.TitleExpectations.goToACPApplicationPage();
    });
    it('Should check that the initial acp approval status is complete', () => {
        cy.get('[data-cy="initialApprovalStatus"]').should('have.text', 'Complete')
    });
    it('Should check that the ACP benifit validation status is Enrolled', () => {
        cy.get('[data-cy="acpBenifitValidationStatus"]').should('have.text', 'Enrolled');
    });
    it('Should check the initial acp approval description', () => {
        cy.get('[data-cy="ACPInitialApprovalFormDescription"]')
            .should('have.text', 'Applicants must complete the ACP application via Good2Go Mobile. Upon completion, applicants will be redirected to the National Verifier to upload necessary documents to certify their eligibility.');
    });
    it('Should check the ACP benifit validation description', () => {
        cy.get('[data-cy="ACPBenifitValidation"]')
            .should('have.text',
                'Good2Go Mobile is your application Service Provider. Your application must be validated and cleared for enrollment.');
    });
    it('Should click on Cancel Plan button', () => {
        PageObjects.Acp.clickOnCancelPlanBtn();
    });
    it('Should go to cancel plan page', () => {
        PageObjects.TitleExpectations.goToCancelPlanPage();
    });
    it('Should check the g2g plan title is Affordable Connectivity Program', () => {
        cy.get('[data-cy="planTitle"]').should('have.text', 'Affordable Connectivity Program');
    });
    it('Should click on Back To Summary  button', () => {
        PageObjects.Acp.clickOnBackToSummaryBtn();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
});
