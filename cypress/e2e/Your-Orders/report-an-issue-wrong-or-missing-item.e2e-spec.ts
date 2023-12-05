import { PageObjects } from '../../support/pageObjects'
import { CONSTANT } from '../../fixtures/constants'

describe('Sign in then go to your orders page,then to report an issue page and click on order not received option', () => {
    before(() => {
        PageObjects.BeforeAll.executeBeforeAll();
    });
    after(() => {
        PageObjects.AccessControl.logoutFromAccount();
    });
    it('Should login successfully', () => {
        PageObjects.AccessControl.successfulLogin();
    });
    it('Should click on your orders', () => {
        PageObjects.YouOrders.clickOnYourOrders();
    });
    it('Should go to your orders page', () => {
        PageObjects.TitleExpectations.goToOrdersPage();
    });
    it('Should click on order details', () => {
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
    it('Should select that the sim as missing items', () => {
        cy.get('.checkbox-label').click();
    });
    it('Should click on next btn', () => {
        PageObjects.YouOrders.clickOnNextBtn();
    });
    it('Should click on back btn', () => {
        PageObjects.YouOrders.clickOnBackBtn();
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
