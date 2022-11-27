import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to acp application page to check the acp status ,as it must be Pending Certification - resume filling acp app then user must be redirected to the acp validate page', () => {
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
    it('Should fill login info with valid data - user with not finished app', () => {
        PageObjects.AccessControl.logIn(CONSTANT.ACP_DATA.NOT_FINISHED_APP.EMAIL, CONSTANT.ACP_DATA.NOT_FINISHED_APP.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPageWithNoMDNS();
    });
    it('Should click on ACP application', () => {
        PageObjects.AccountSummary.clickOnACPApplication();
    });
    it('Should go to acp status page', () => {
        PageObjects.TitleExpectations.goToACPApplicationPage();
    });
    it('Should check that the initial acp approval is Pending Certification', () => {
        cy.get('[data-cy="initialApprovalStatus"]').should('have.text', 'Pending Certification')
    });
    it('Should click on Cancel Application btn', () => {
        PageObjects.Acp.clickOnCancelAppBtn();
    });
    it('Should click on Cancel btn from the pop up', () => {
        PageObjects.Acp.clickOnCancelBtnFromPopUp();
    });
    it('Should go to acp status page', () => {
        PageObjects.TitleExpectations.goToACPApplicationPage();
    });
    it('Should click on Resume Filling Btn', () => {
        PageObjects.Acp.clickOnResumeFillingBtn();
    });
    it('Should go to acp validate page', () => {
        PageObjects.TitleExpectations.goToACPValidatePage();
    });
    it('Should check that the Finish Application btn exists', () => {
        cy.get('[data-cy="modal--primary-url-button"]').should('exist');
    });
    it('Should stay in acp validate page', () => {
        PageObjects.TitleExpectations.goToACPValidatePage();
    });
});
