import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Do i qualify button redirection from home page to acp landing page', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should click on do i qualify button', () => {
        PageObjects.HomePage.clickOnDoIQualifyBtn();
    });
    it('Should go to acp ladning page', () => {
        PageObjects.TitleExpectations.goToACPPage();
    });
    it('Should go to acp ladning page and change the view port to make sure that the user is redirected to the eligibility section', () => {
        PageObjects.TitleExpectations.goToACPPage();
    });
    it('Should  change the view port to make sure that the user is redirected to the eligibility section', () => {
        cy.viewport(1024, 800);
    });
    it('Should make sure that the who is eligible section is visible', () => {
        cy.get('[data-cy="whoIsEligibleHeader"]').should('be.visible');
    });
    it('Should get the previous view port back', () => {
        cy.viewport(1490, 2000);
    });
    it('Should click on sign in', () => {
        PageObjects.HomePage.clickOnSignIn();
    });
    it('Should go to login page', () => {
        PageObjects.TitleExpectations.goToLogInPage();
    });
    it('Should fill login info with valid data', () => {
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_G_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_G_ACCOUNT.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page after signing in', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on logo to go to home page', () => {
        PageObjects.HomePage.clickOnG2gLogo();
    });
    it('Should go to home page', () => {
        PageObjects.TitleExpectations.goToHomePage();
    });
    it('Should click on do i qualify button', () => {
        PageObjects.HomePage.clickOnDoIQualifyBtn();
    });
    it('Should go to acp ladning page and change the view port to make sure that the user is redirected to the eligibility section', () => {
        PageObjects.TitleExpectations.goToACPPage();
    });
    it('Should  change the view port to make sure that the user is redirected to the eligibility section', () => {
        cy.viewport(1024, 800);
    });
    it('Should make sure that the who is eligible section is visible', () => {
        cy.get('[data-cy="whoIsEligibleHeader"]').should('be.visible');
    });
    it('Should get the previous view port back', () => {
        cy.viewport(1490, 2000);
    });
    

});
