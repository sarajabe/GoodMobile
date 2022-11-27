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
    it('Should click on wrong or missing item option', () => {
        PageObjects.YouOrders.clickOnWrongOrMissingItem();
    });
    it('Should validate going to wrong or missing item page', () => {
        PageObjects.TitleExpectations.goToWrongOrMissingItemPage();
    });
    it('Should click on next btn without selecting items ', () => {
        PageObjects.YouOrders.clickOnNextBtn();
    });
    it('Should check items validation message ', () => {
        cy.get('[data-cy="itemsValidationMsg"]').should('have.text','Please select at least one item to proceed');
    });
    it('Should select that the sim and the device as missing items', () => {
        cy.get(':nth-child(1) > .details-side > .checkbox-label').click();
        cy.get(':nth-child(4) > .details-side > .checkbox-label').click();
    });
    it('Should click on next btn', () => {
        PageObjects.YouOrders.clickOnNextBtn();
    });
    it('Should click on back btn', () => {
        PageObjects.YouOrders.clickOnBackBtn();
    });
    it('Should select that the sim ', () => {
        cy.get(':nth-child(1) > .details-side > .checkbox-label').click();
    });
    it('Should click on next btn', () => {
        PageObjects.YouOrders.clickOnNextBtn();
    });
    it('Should click on back btn', () => {
        PageObjects.YouOrders.clickOnBackBtn();
    });
    it('Should select that the sim and the device as missing items', () => {
        cy.get(':nth-child(1) > .details-side > .checkbox-label').click();
        cy.get(':nth-child(4) > .details-side > .checkbox-label').click();
    });
    it('Should click on next btn', () => {
        PageObjects.YouOrders.clickOnNextBtn();
    });
    it('Should validate going to wrong or missing item page', () => {
        PageObjects.TitleExpectations.goToWrongOrMissingItemPage();
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
