import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page,then to report an issue page and click on retrun device option', () => {
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
        PageObjects.AccessControl.logIn(CONSTANT.ACCESS.USER_AD_ACCOUNT.EMAIL, CONSTANT.ACCESS.USER_AD_ACCOUNT.PASSWORD);
    });
    it('Should click on login button', () => {
        PageObjects.AccessControl.logInButton();
    });
    it('Should go to account summary page', () => {
        PageObjects.TitleExpectations.goToAccountSummaryPage();
    });
    it('Should click on your orders', () => {
        PageObjects.YouOrders.clickOnYourOrders6thChild();
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
    it('Should click on return device option', () => {
        PageObjects.YouOrders.clickOnReturnDevice();
    });
    it('Should validate going to return device page', () => {
        PageObjects.TitleExpectations.goToReturnDevicePage();
    });
    it('Should click on leave us a message', () => {
        PageObjects.YouOrders.clickOnLeaveUsAMessageLinkForReturnDevice();
    });
    it('Should click on submit btn', () => {
        PageObjects.YouOrders.clickOnSubmitBtn();
    });
    it('Should check the validation messages when fields are empty', () => {
        cy.get('[data-cy="phoneIsRequired"]').should('have.text','Phone number is required');
        cy.get('[data-cy="issueDescriptionIsRequired"]').should('have.text','Issue description is required');
    });
    it('Should fill in an invalid phone number', () => {
        PageObjects.YouOrders.fillInPhoneNumber(CONSTANT.MDNS.INVALID);
    });
    it('Should click on submit btn', () => {
        PageObjects.YouOrders.clickOnSubmitBtn();
    });
    it('Should check the validation message when phone number is invalid', () => {
        cy.get('[data-cy="phoneNumberIsInvalid"]').should('have.text',' Phone number is invalid ');
    });
    it('Should fill in valid phone number', () => {
        PageObjects.YouOrders.fillInPhoneNumber(CONSTANT.MDNS.IMPACTED);
    });
    it('Should fill in issue description', () => {
        PageObjects.YouOrders.fillInIssueDescription();
    });
   
    
});
