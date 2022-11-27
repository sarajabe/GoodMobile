import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page,then to report an issue page and click on order not received option', () => {
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
    it('Should click on your orders', () => {
        PageObjects.YouOrders.clickOnYourOrders7thChild();
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
    it('Should click on order not received', () => {
        PageObjects.YouOrders.clickOnorderNotReceived();
    });
    it('Should validate going to order not received page', () => {
        PageObjects.TitleExpectations.goToOrderNotReceivedPage();
    });
    it('Should click on leave us a message', () => {
        PageObjects.YouOrders.clickOnLeaveUsAMessageBtn();
    });
    // Leave the phone number and description fields empty and assert tyhe required validation messages
    it('Should click on submit btn', () => {
        PageObjects.YouOrders.clickOnSubmitBtn();
    });
    it('Should assert the validation messages to be required', () => {
        cy.get('[data-cy="phoneIsRequired"]').should('have.text', 'Phone number is required');
        cy.get('[data-cy="issueDescriptionIsRequired"]').should('have.text', 'Issue description is required');
    });
    // fill in the issue description and a valid phone number
    it('Should fill in phone number', () => {
        PageObjects.YouOrders.fillInPhoneNumber(CONSTANT.MDNS.IMPACTED);
    });
    it('Should fill in issue description', () => {
        PageObjects.YouOrders.fillInIssueDescription();
    });
    it('Should click on submit btn', () => {
        PageObjects.YouOrders.clickOnSubmitBtn();
    });
    it('Should go to report confirmation page', () => {
        PageObjects.TitleExpectations.goToOrderNotReceivedPage();
        cy.get('.note-banner > :nth-child(1)').should('have.text', 'Thank you for contacting us.');
    });
    it('Should click on done btn', () => {
        PageObjects.YouOrders.clickOnDoneBtn();
    });
    it('Should go to report an issue page', () => {
        PageObjects.TitleExpectations.goToReportAnIssuePage();
    });
    //Now, enter an invalid phone number
    it('Should click on order not received', () => {
        PageObjects.YouOrders.clickOnorderNotReceived();
    });
    it('Should validate going to order not received page', () => {
        PageObjects.TitleExpectations.goToOrderNotReceivedPage();
    });
    it('Should click on leave us a message', () => {
        PageObjects.YouOrders.clickOnLeaveUsAMessageBtn();
    });
    it('Should fill inan invalid phone number', () => {
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
});
