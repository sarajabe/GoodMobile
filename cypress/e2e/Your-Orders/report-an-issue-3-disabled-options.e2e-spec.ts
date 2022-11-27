import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page,report an issue, check that the return device , update shipping address and order not received are disabled ', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_KK_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_KK_ACCOUNT.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on your orders', () => {
        PageObjects.YouOrders.clickOnYourOrders7thChild();
    });
    it('Should go to your orders page', () => {
        PageObjects.TitleExpectations.goToOrdersPage();
    });
    it('Should click on view invoice', () => {
        PageObjects.YouOrders.clickOnSecondOrderDetails();
    });
    it('Should go to order details page', () => {
        PageObjects.TitleExpectations.goToOrderDetailsPage();
    });
    it('Should click on report an issue', () => {
        PageObjects.YouOrders.clickOnReportAnIssue();
    });
    it('Should go to report an issue page', () => {
        PageObjects.TitleExpectations.goToReportAnIssuePage();
    });
    it('Should check that the order not received is disabled', () => {
        cy.get('.options-container > :nth-child(1)').should('have.class', 'disabled');
    });
    it('Should check that the update shipping address is disabled', () => {
        cy.get('.options-container > :nth-child(3)').should('have.class', 'disabled');
    });
    it('Should check that the return device option is disabled', () => {
        cy.get('.options-container > :nth-child(4)').should('have.class', 'disabled');
    });
    it('Should stay in report an issue page', () => {
        PageObjects.TitleExpectations.goToReportAnIssuePage();
    });
});
