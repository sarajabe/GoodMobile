import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page,then to report an issue page and click on something else option', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.LISA_ACCOUNT.EMAIL, CONSTANT.ACCESS.LISA_ACCOUNT.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on your orders', () => {
        PageObjects.YouOrders.clickOnYourOrders();
    });
    it('Should go to your orders page', () => {
        PageObjects.TitleExpectations.goToOrdersPage();
    });
    it('Should click on view invoice', () => {
        PageObjects.YouOrders.clickOnOrderDetails();
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
    // click on something else option 
    it('Should click on something else option', () => {
        PageObjects.YouOrders.clickOnSomethingIssue();
    });
    it('Should validate going to order not received page', () => {
        PageObjects.TitleExpectations.goToSomethingElsePage();
    });
    it('Should click on submit btn', () => {
        PageObjects.YouOrders.clickOnSubmitBtn();
    });
    it('Should assert the validation messages to be required', () => {
        cy.get('[data-cy="phoneIsRequired"]').should('have.text', 'Phone number is required');
        cy.get('[data-cy="issueDescriptionIsRequired"]').should('have.text', 'Issue description is required');
    });
    //Now, enter an invalid phone number
    it('Should fill in an invalid phone number', () => {
        PageObjects.YouOrders.fillInPhoneNumber(CONSTANT.MDNS.INVALID);
    });
    it('Should fill in issue description', () => {
        PageObjects.YouOrders.fillInIssueDescription();
    });
    it('Should click on submit btn', () => {
        PageObjects.YouOrders.clickOnSubmitBtn();
    });
    it('Should assert the validation messages to be invalid', () => {
        cy.get('[data-cy="phoneNumberIsInvalid"]').should('have.text', ' Phone number is invalid ');
    });
    it('Should click on cancel btn', () => {
        PageObjects.YouOrders.clickOnCancelBtn();
    });
    it('Should go to report an issue page', () => {
        PageObjects.TitleExpectations.goToReportAnIssuePage();
    });
    it('Should click on something else option', () => {
        PageObjects.YouOrders.clickOnSomethingIssue();
    });
    it('Should validate going to order not received page', () => {
        PageObjects.TitleExpectations.goToSomethingElsePage();
    });
    // fill in the issue description and a valid phone number
    it('Should fill in phone number', () => {
        PageObjects.YouOrders.fillInPhoneNumber(CONSTANT.MDNS.IMPACTED);
    });
    it('Should fill in issue description', () => {
        PageObjects.YouOrders.fillInIssueDescription();
    });
    it('Should assert that there are no validation messages', () => {
        cy.get('[data-cy="phoneNumberIsInvalid"]').should('not.exist');
        cy.get('[data-cy="phoneIsRequired"]').should('not.exist');
        cy.get('[data-cy="issueDescriptionIsRequired"]').should('not.exist');
    });
});