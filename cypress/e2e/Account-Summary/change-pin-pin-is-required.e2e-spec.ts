import { PageObjects } from '../../support/pageObjects';
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to account summary to change pin and - keep field empty', () => {
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
    it('Should fill login info with valid data', () => {
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_G_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_G_ACCOUNT.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on eye icon to see the pin number', () => {
        PageObjects.AccountSummary.clickOnEyeIcon();
    });
    it('Should show the pin and it should be equals to (9821)', () => {
        cy.get('.pass').should('have.text', '9821');
    });
    it('Should click on Change PIN number', () => {
        PageObjects.AccountSummary.clickOnChangePinNumber();
    });
    it('Should check that the submit btn is disabled', () => {
        cy.get('[data-cy=currentPin]').clear();
        cy.get('[data-cy=submitBtn]').should('be.disabled');
        cy.get('[data-cy="PinCardTitle"]').click();
    });
    it('Should validate the required pin message', () => {
        cy.get('[data-cy="pinIsRequiredMessage"]').should('have.text', 'Account Pin Code required');
    });
});
