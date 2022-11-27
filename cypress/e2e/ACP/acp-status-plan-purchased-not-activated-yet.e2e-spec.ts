import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to acp application page - acp initials approval status must be complete - ACP benefit must be in progress', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccountAfterBeingInACPApp();
    });
    it('Should click on sign in', () => {
        PageObjects.HomePage.clickOnSignIn();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it('Should fill login info with valid data - user with purchased acp plan but not activated yet', () => {
        PageObjects.AccessControl.logIn(CONSTANT.ACP_DATA.PLAN_PURCHASEDD_NOT_ACTIVATED_YET.EMAIL, CONSTANT.ACP_DATA.PLAN_PURCHASEDD_NOT_ACTIVATED_YET.PASSWORD);
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
    it('Should check that the initial acp approval is Pending Certification', () => {
        cy.get('[data-cy="initialApprovalStatus"]').should('have.text', 'Complete')
    });
    it('Should check that the ACP benifit validation is In Progress', () => {
        cy.get('[data-cy="acpBenifitValidationStatus"]').should('have.text', 'In Progress')
    });
    it('Should check that the initial acp approval description', () => {
        cy.get('[data-cy="ACPInitialApprovalFormDescription"]')
            .should('have.text', 'Applicants must complete the ACP application via Good2Go Mobile. Upon completion, applicants will be redirected to the National Verifier to upload necessary documents to certify their eligibility.')
    });
    it('Should check the ACP benifit validation description', () => {
        cy.get('[data-cy="ACPBenifitValidation"]')
            .should('have.text',
                'Good2Go Mobile is your application Service Provider. Your application must be validated and cleared for enrollment.')
    });
});
